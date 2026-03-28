import docker
import os
import logging

client = docker.from_env()

def run_task_container(image, command, task_id, gpu_id=0):
    # Uruchamia odizolowany kontener z zadaniem AI.
    data_path = os.path.abspath("./data")
    output_path = os.path.abspath("./output")
    os.makedirs(data_path, exist_ok=True)
    os.makedirs(output_path, exist_ok=True)

    try:
        logging.info(f"🐳 Start kontenera {task_id}")
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
        
        result = container.wait(timeout=3600) # Timeout 1h dla bezpieczeństwa
        logs = container.logs().decode('utf-8')
        container.remove()
        
        return {
            "status": "completed" if result['StatusCode'] == 0 else "failed",
            "logs": logs
        }
    except Exception as e:
        logging.error(f"❌ Błąd Dockera: {e}")
        return {"status": "error", "error": str(e)}