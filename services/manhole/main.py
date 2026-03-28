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
    """Pobiera pełne statystyki i pakuje je zgodnie z manhole.proto"""
    try:
        # Pobieramy dane z hardware.py (poprawionego wcześniej)
        stats = hardware.get_full_stats()
        
        # Tworzymy główny request
        request = manhole_pb2.HeartbeatRequest(
            id=config.NODE_ID,
            status=True,
            ram_usage=stats['ram_usage']
        )
        
        # Iterujemy po liście procesorów i dodajemy do wiadomości Proto
        for c in stats['cpus']:
            cpu_item = request.cpus.add() # Tworzy nowy obiekt CpuUsageInfo wewnątrz listy
            cpu_item.cpu_id = c['cpu_id']
            cpu_item.thread_usage = c['thread_usage']
            cpu_item.temperature = c['temperature']

        # Iterujemy po liście kart graficznych
        for g in stats['gpus']:
            gpu_item = request.gpus.add() # Tworzy nowy obiekt GpuUsageInfo wewnątrz listy
            gpu_item.gpu_id = g['gpu_id']
            gpu_item.vram_usage = g['vram_usage']
            gpu_item.temperature = g['temperature']

        # Wysłanie przez gRPC
        response = stub.Heartbeat(request)
        return response.success
        
    except grpc.RpcError as e:
        logging.warning(f"⚠️ Brain offline ({e.code()})")
        return False
    except Exception as e:
        logging.error(f"❌ Błąd pakowania danych Proto: {e}")
        return False

def poll_for_tasks():
    """Odpytuje Brain o zadania. Obsługuje brak połączenia."""
    try:
        response = requests.get(
            f"{config.ORCHESTRATOR_URL}/node/tasks/poll", 
            params={"api_key": config.API_KEY},
            timeout=3 # Krótki timeout, żeby nie blokować pętli
        )
        if response.status_code == 200:
            return response.json()
    except requests.exceptions.ConnectionError:
        # Serwer HTTP nie działa? Nie śmiecimy w konsoli, po prostu wracamy.
        pass
    except Exception as e:
        logging.debug(f"Błąd podczas odpytywania o zadania: {e}")
    return None

def main():
    logging.info(f"🚀 Sewers Manhole ID: {config.NODE_ID}")
    
    # Tworzymy kanał raz
    with grpc.insecure_channel(config.GATEWAY_URL) as channel:
        stub = manhole_pb2_grpc.HeartbeatStub(channel)
        
        while True:
            # 1. Heartbeat
            if send_heartbeat_rpc(stub):
                logging.info("💓 Heartbeat dostarczony")
            else:
                logging.warning("💓 Heartbeat nieudany (Brain offline?)")
            
            # 2. Zadania
            task = poll_for_tasks()
            if task:
                # Tutaj wejdzie procesowanie zadania (docker itp.)
                logging.info(f"📥 Otrzymano zadanie: {task.get('id')}")
            
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