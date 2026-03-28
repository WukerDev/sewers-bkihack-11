import psutil
import logging

# Spróbuj zaimportować bibliotekę NVIDIA
try:
    from pynvml import *
    nvmlInit()
    HAS_GPU = True
except Exception:
    HAS_GPU = False

def get_full_stats():
    mem = psutil.virtual_memory()
    
    # 1. Pobieramy całkowite zużycie CPU (średnia ze wszystkich rdzeni)
    # Jeśli masz 1 fizyczny procesor, to interesuje nas jedna wartość globalna.
    global_cpu_usage = psutil.cpu_percent(interval=None)
    
    # 2. Wykrywanie fizycznych procesorów (Socketów)
    # Na Windows/Linux 'psutil.cpu_count(logical=False)' to rdzenie.
    # Aby sprawdzić Sockets (sztuki procesora), używamy sztuczki lub zakładamy 1 dla PC.
    # W większości bibliotek pythonowych na Windows ciężko o 'sockets' bez WMI.
    # Przyjmijmy bezpieczne założenie dla Twojej maszyny (1 procesor fizyczny).
    
    cpus_data = []
    
    # Statystyka dla pierwszego (i zazwyczaj jedynego w PC) fizycznego procesora
    cpu_temp = 0.0
    try:
        temps = psutil.sensors_temperatures()
        # Szukamy ogólnej temperatury "Package" (całej sztuki procesora)
        if 'coretemp' in temps:
            cpu_temp = temps['coretemp'][0].current
    except Exception:
        pass

    cpus_data.append({
        "cpu_id": 0, # Pierwszy fizyczny procesor
        "thread_usage": global_cpu_usage, # Średnia praca całego procesora
        "temperature": cpu_temp
    })

    # Jeśli to serwer dwu-procesorowy (Dual Socket), psutil.cpu_percent(percpu=True) 
    # musiałby być dzielony na pół, ale dla Twoich testów 1 sztuka jest kluczowa.

    gpus_data = []
    if HAS_GPU:
        try:
            device_count = nvmlDeviceGetCount()
            for i in range(device_count):
                handle = nvmlDeviceGetHandleByIndex(i)
                mem_info = nvmlDeviceGetMemoryInfo(handle)
                util = nvmlDeviceGetUtilizationRates(handle)
                temp = nvmlDeviceGetTemperature(handle, NVML_TEMPERATURE_GPU)
                
                gpus_data.append({
                    "gpu_id": i,
                    "vram_used_bytes": mem_info.used,
                    "load_percent": util.gpu,
                    "temperature": temp
                })
        except Exception as e:
            logging.error(f"⚠️ GPU Error: {e}")

    return {
        "total_ram": mem.total,
        "ram_used_bytes": mem.used,
        "cpus": cpus_data,
        "gpus": gpus_data
    }