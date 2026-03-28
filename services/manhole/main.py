import time
import requests
import config
import hardware
import docker_orchestrator
import storage
import manhole_pb2 # Plik wygenerowany z manhole.proto

def send_heartbeat():
    """Pobiera pełne statystyki sprzętowe, pakuje w Protobuf i wysyła binarnie do Brain."""
    stats = hardware.get_full_stats() 

    # Tworzenie wiadomości z wygenerowanej klasy Proto
    msg = manhole_pb2.Heartbeat()
    msg.status = True
    msg.ram_usage = stats['ram_usage']

    for c in stats['cpus']:
        cpu = msg.cpus.add()
        cpu.cpu_id = c['cpu_id']
        cpu.thread_usage = c['thread_usage']
        cpu.temperature = c['temperature']

    for g in stats['gpus']:
        gpu = msg.gpus.add()
        gpu.gpu_id = g['gpu_id']
        gpu.vram_usage = g['vram_usage']
        gpu.temperature = g['temperature']

    # Serializacja do "gołych bajtów"
    binary_payload = msg.SerializeToString()

    try:
        response = requests.post(
            f"{config.ORCHESTRATOR_URL}/node/heartbeat",
            data=binary_payload,
            headers={
                'Content-Type': 'application/x-protobuf',
                'X-Node-Key': config.API_KEY # Identyfikacja węzła w nagłówku
            }
        )
        if response.status_code != 200:
            print(f"⚠️ Brain odebrał heartbeat, ale zwrócił status: {response.status_code}")
    except Exception as e:
        print(f"❌ Błąd krytyczny komunikacji (Heartbeat): {e}")

def poll_for_tasks():
    """Odpytuje Brain o nowe zadania przypisane do tego węzła."""
    try:
        response = requests.get(
            f"{config.ORCHESTRATOR_URL}/node/tasks/poll", 
            params={"api_key": config.API_KEY}
        )
        if response.status_code == 200:
            return response.json() 
    except Exception as e:
        print(f"❌ Błąd podczas sprawdzania kolejki zadań: {e}")
    return None

def main():
    print(f"🚀 Sewers Manhole: Węzeł aktywny (Klucz: {config.API_KEY[:8]}...).")
    
    while True:
        # 1. Pulsowanie (Status systemu)
        send_heartbeat()
        
        # 2. Sprawdzanie oczekujących zadań
        task = poll_for_tasks()
        
        if task:
            task_id = task['id']
            print(f"📥 Otrzymano zadanie {task_id} (Typ: {task['type']})")
            
            try:
                # KROK A: Pobieranie danych wejściowych
                storage.download_dataset(task['dataset_url'], f"./data/{task_id}.zip")
                
                # KROK B: Uruchomienie w izolowanym kontenerze Docker
                print(f"⚙️  Uruchamianie kontenera dla zadania {task_id}...")
                result = docker_orchestrator.run_task_container(
                    image=task['docker_image'],
                    command=task['command'],
                    task_id=task_id
                )
                
                # KROK C: Weryfikacja wyniku (Suma kontrolna)
                # Zakładamy, że wynikowy model/plik zawsze nazywa się wg wzoru poniżej
                checksum = storage.calculate_checksum(f"./output/model_{task_id}.bin")
                
                # KROK D: Raportowanie sukcesu do Brain
                final_report = {
                    "task_id": task_id,
                    "node_key": config.API_KEY,
                    "status": result['status'],
                    "checksum": checksum,
                    "logs": result['logs']
                }
                requests.post(f"{config.ORCHESTRATOR_URL}/node/tasks/report", json=final_report)
                print(f"✅ Zadanie {task_id} zakończone i zaraportowane.")

            except Exception as task_err:
                print(f"❌ Błąd krytyczny podczas przetwarzania zadania {task_id}: {task_err}")
                # Tutaj można dodać wysłanie raportu o błędzie do Brain

        # Oczekiwanie przed kolejną iteracją (zdefiniowane w config.py)
        time.sleep(config.POLLING_INTERVAL)

if __name__ == "__main__":
    main()