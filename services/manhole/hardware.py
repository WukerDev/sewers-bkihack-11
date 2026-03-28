import psutil
import logging

# Spróbuj zaimportować bibliotekę NVIDIA, jeśli jest dostępna
try:
    from pynvml import *
    nvmlInit()
    HAS_GPU = True
except Exception:
    HAS_GPU = False

def get_full_stats():
    """Pobiera kompletne statystyki sprzętowe."""
    
    # 1. RAM (w bajtach)
    mem = psutil.virtual_memory()
    
    # 2. CPU - zużycie na każdy rdzeń osobno
    # interval=None sprawia, że nie blokujemy wątku (bierze dane od ostatniego wywołania)
    cpu_percents = psutil.cpu_percent(percpu=True)
    
    # Temperatura CPU na Windows jest trudna do pobrania przez psutil.
    # Zazwyczaj zwraca pustą listę. Wstawiamy 0.0 jako fallback.
    cpu_temps = []
    try:
        temps = psutil.sensors_temperatures()
        if 'coretemp' in temps:
            cpu_temps = [t.current for t in temps['coretemp']]
    except Exception:
        pass

    cpus_data = []
    for i, usage in enumerate(cpu_percents):
        cpus_data.append({
            "cpu_id": i,
            "thread_usage": usage,
            "temperature": cpu_temps[i] if i < len(cpu_temps) else 0.0
        })

    # 3. GPU (NVIDIA)
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
            logging.error(f"⚠️ Błąd odczytu GPU: {e}")

    return {
        "total_ram": mem.total,           # Całkowity RAM (Bajty)
        "ram_used_bytes": mem.used,       # Użyty RAM (Bajty)
        "cpus": cpus_data,
        "gpus": gpus_data
    }