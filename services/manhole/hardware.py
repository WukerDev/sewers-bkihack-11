import psutil
import logging
import wmi # Dla temperatury na Windows

try:
    from pynvml import *
    nvmlInit()
    HAS_GPU = True
except Exception:
    HAS_GPU = False

def get_cpu_temp():
    """Próbuje pobrać temperaturę procesora na Windows przez WMI."""
    try:
        w = wmi.WMI(namespace="root\\wmi")
        temperature_info = w.MSAcpi_ThermalZoneTemperature()[0]
        # Temperatura w WMI jest w decykelwinach (0.1K)
        return (temperature_info.CurrentTemperature / 10.0) - 273.15
    except:
        return 0.0

def get_full_stats():
    mem = psutil.virtual_memory()
    
    # Średnie zużycie ze WSZYSTKICH rdzeni/wątków tego procesora
    global_cpu_usage = psutil.cpu_percent(interval=None)
    
    cpus_data = [{
        "cpu_id": 0,
        "thread_usage": global_cpu_usage,
        "temperature": get_cpu_temp()
    }]

    gpus_data = []
    if HAS_GPU:
        try:
            device_count = nvmlDeviceGetCount()
            for i in range(device_count):
                handle = nvmlDeviceGetHandleByIndex(i)
                mem_info = nvmlDeviceGetMemoryInfo(handle)
                temp = nvmlDeviceGetTemperature(handle, NVML_TEMPERATURE_GPU)
                
                gpus_data.append({
                    "gpu_id": i,
                    "vram_total_bytes": mem_info.total,
                    "vram_used_bytes": mem_info.used,
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