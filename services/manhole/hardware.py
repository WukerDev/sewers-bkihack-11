import pynvml
import psutil
import config
import logging

def get_full_stats():
    # CPU Stats
    cpus = []

    # Temperatura CPU jest trudna do pobrania uniwersalnie (zależy od OS/HW)
    # Na Linuxie często zadziała psutil.sensors_temperatures()
    psutil.cpu_percent(percpu=True)

    # Pobieranie temperatur (bezpieczniejsze)
    get_temps = getattr(psutil, "sensors_temperatures", lambda: {})
    temps = get_temps()
    core_temps = temps.get('coretemp', [])

    # psutil.cpu_percent(percpu=True) daje listę użycia każdego rdzenia

    for i, usage in enumerate(psutil.cpu_percent(percpu=True)):
        temp = core_temps[i].current if i < len(core_temps) else 0.0
        cpus.append({
            "cpu_id": i,
            "thread_usage": int(usage),
            "temperature": float(temp)
        })

    # GPU Stats (NVIDIA)
    gpus = []
    try:
        pynvml.nvmlInit()
        for i in range(pynvml.nvmlDeviceGetCount()):
            handle = pynvml.nvmlDeviceGetHandleByIndex(i)
            info = pynvml.nvmlDeviceGetMemoryInfo(handle)
            temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
            gpus.append({
                "gpu_id": i,
                "vram_usage": float((info.used / info.total) * 100),
                "temperature": float(temp)
            })
    except Exception as e:
        logging.debug(f"Brak GPU NVIDIA lub błąd sterowników: {e}")
    finally:
        try:
            pynvml.nvmlShutdown()
        except: pass

    return {
        "cpus": cpus,
        "gpus": gpus,
        "ram_usage": psutil.virtual_memory().percent
    }

'''
    return {
        "id": config.NODE_ID,
        "status": True,
        "cpus": cpus,
        "gpus": gpus,
        "ram_usage": psutil.virtual_memory().percent
    }'''