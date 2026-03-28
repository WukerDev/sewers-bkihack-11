import time
import requests
import logging
import grpc
import config
import hardware
import docker_orchestrator
import storage
import manhole_pb2
import manhole_pb2_grpc

# Konfiguracja logowania
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def send_heartbeat_rpc(stub):
    stats = hardware.get_full_stats()
    request = manhole_pb2.HeartbeatRequest(
        id=config.NODE_ID,
        status=True,
        ram_usage=stats['ram_usage'],
        cpus=[manhole_pb2.CpuUsageInfo(**c) for c in stats['cpus']],
        gpus=[manhole_pb2.GpuUsageInfo(**g) for g in stats['gpus']]
    )
    try:
        response = stub.Heartbeat(request)
        return response.success
    except grpc.RpcError as e:
        logging.error(f"📡 Błąd połączenia z Gateway: {e.code()}")
        return False

def poll_for_tasks():
    """Odpytuje Brain o nowe zadania."""
    try:
        response = requests.get(
            f"{config.ORCHESTRATOR_URL}/node/tasks/poll", 
            params={"api_key": config.API_KEY},
            timeout=5
        )
        if response.status_code == 200:
            return response.json() 
    except Exception as e:
        logging.error(f"❌ Błąd sprawdzania zadań: {e}")
    return None

def main():
    logging.info(f"🚀 Sewers Manhole uruchomiony. ID: {config.NODE_ID}")
    
    # Używamy jednego kanału gRPC dla wydajności
    with grpc.insecure_channel(config.GATEWAY_URL) as channel:
        stub = manhole_pb2_grpc.HeartbeatStub(channel)
        
        while True:
            # 1. Pulsowanie
            success = send_heartbeat_rpc(stub)
            if success:
                logging.info("💓 Heartbeat OK")
            
            # 2. Polling zadań (można to też zamienić na gRPC Streaming w przyszłości)
            task = poll_for_tasks() # Twój dotychczasowy kod requests.get
            if task:
                process_task(task)
            
            time.sleep(config.POLLING_INTERVAL)

def process_task(task):
    task_id = task['id']
    try:
        # Poczatek pracy
        local_zip = f"./data/{task_id}.zip"
        storage.download_dataset(task['dataset_url'], local_zip)
        
        result = docker_orchestrator.run_task_container(
            image=task['docker_image'],
            command=task['command'],
            task_id=task_id
        )
        
        # Próba obliczenia checksumy (tylko jeśli plik istnieje)
        output_file = f"./output/model_{task_id}.bin"
        checksum = storage.calculate_checksum(output_file) if os.path.exists(output_file) else "no_output"
        
        # Raportowanie
        # ... wysyłka raportu ...
    except Exception as e:
        logging.error(f"Błąd zadania {task_id}: {e}")

if __name__ == "__main__":
    main()