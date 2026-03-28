import docker
import os
import logging
import main

client = docker.from_env()

def run_task_container(image, command, task_id, gpu_id=0):
    client = docker.from_env()
    main.NODE_STATUS = "busy" # Zmieniamy status na zajęty
    
    try:
        logging.info(f"⚙️ Uruchamiam zadanie {task_id}...")
        container = client.containers.run(
            image=image,
            command=command,
            name=f"sewers-task-{task_id}",
            device_requests=[
                docker.types.DeviceRequest(device_ids=[gpu_id], capabilities=[['gpu']])
            ] if gpu_id is not None else [],
            volumes={
                data_path: {'bind': '/app/data', 'mode': 'ro'},
                output_path: {'bind': '/app/output', 'mode': 'rw'}
            },
            mem_limit="8g", # Przykład limitu
            nano_cpus=4000000000, # Limit 4 rdzeni (w nanosekundach)
            detach=True
        )
        container.wait()
        return {"status": "success"}
    finally:
        main.NODE_STATUS = "free"