import docker
import os

client = docker.from_env()

def run_task_container(image, command, task_id, gpu_id=0):
    """
    Uruchamia odizolowany kontener z zadaniem AI.
    
    Wejście:
    - image (str): Nazwa obrazu (np. 'pytorch/pytorch:latest')
    - command (str): Komenda do wykonania wewnątrz kontenera.
    - task_id (str): Unikalny ID zadania dla logów.
    - gpu_id (int): Indeks karty graficznej do przypisania.
    
    Wyjście:
    - Dict: Wynik operacji (success, logs, container_id).
    """
    try:
        # Tworzymy ograniczone zasoby (bezpieczeństwo!)
        container = client.containers.run(
            image=image,
            command=command,
            name=f"sewers-task-{task_id}",
            device_requests=[
                docker.types.DeviceRequest(device_ids=[str(gpu_id)], capabilities=[['gpu']])
            ],
            # Całkowicie odcinamy internet kontenerowi zadania (opcjonalnie)
            network_disabled=True, 
            # Montujemy tylko niezbędne foldery
            volumes={
                os.path.abspath("./data"): {'bind': '/app/data', 'mode': 'ro'},
                os.path.abspath("./output"): {'bind': '/app/output', 'mode': 'rw'}
            },
            detach=True,
            mem_limit="16g" # Limit RAMu dla bezpieczeństwa hosta
        )
        
        result = container.wait() # Czekamy na koniec pracy
        logs = container.logs().decode('utf-8')
        container.remove() # Sprzątamy po sobie
        
        return {
            "status": "completed" if result['StatusCode'] == 0 else "failed",
            "logs": logs
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}