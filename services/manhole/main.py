import time
import requests
import config
import hardware
import docker_orchestrator
import storage

def report_status():
    """Wysyła heartbeat i stan GPU do Brain."""
    stats = hardware.get_gpu_stats()
    payload = {
        "api_key": config.API_KEY,
        "status": "idle",
        "hardware": stats
    }
    try:
        requests.post(f"{config.ORCHESTRATOR_URL}/node/heartbeat", json=payload)
    except:
        print("Brain nie odpowiada...")

def poll_for_tasks():
    """Pyta Brain: 'Czy masz dla mnie robotę?'."""
    try:
        response = requests.get(f"{config.ORCHESTRATOR_URL}/node/tasks/poll", 
                                 params={"api_key": config.API_KEY})
        if response.status_code == 200:
            return response.json() # Zwraca specyfikację taska
    except:
        return None
    return None

def main():
    print("🚀 Sewers Manhole: Węzeł aktywny. Czekam na zadania...")
    
    while True:
        report_status()
        
        task = poll_for_tasks()
        if task:
            task_id = task['id']
            print(f"📥 Otrzymano zadanie {task_id}: {task['type']}")
            
            # 1. Pobierz dane
            storage.download_dataset(task['dataset_url'], f"./data/{task_id}.zip")
            
            # 2. Wykonaj (Docker)
            result = docker_orchestrator.run_task_container(
                image=task['docker_image'],
                command=task['command'],
                task_id=task_id
            )
            
            # 3. Oblicz checksum i wyślij raport
            checksum = storage.calculate_checksum(f"./output/model_{task_id}.bin")
            
            final_report = {
                "task_id": task_id,
                "status": result['status'],
                "checksum": checksum,
                "logs": result['logs']
            }
            requests.post(f"{config.ORCHESTRATOR_URL}/node/tasks/report", json=final_report)
            print(f"✅ Zadanie {task_id} zakończone i raportowane.")

        time.sleep(config.POLLING_INTERVAL)

if __name__ == "__main__":
    main()