import pynvml
import psutil

def get_full_stats():
    # 1. Statystyki CPU
    cpus = []
    # psutil.cpu_percent(percpu=True) daje listę użycia każdego rdzenia
    for i, usage in enumerate(psutil.cpu_percent(percpu=True)):
        # Temperatura CPU jest trudna do pobrania uniwersalnie (zależy od OS/HW)
        # Na Linuxie często zadziała psutil.sensors_temperatures()
        temp = 0.0
        temps = psutil.sensors_temperatures()
        if 'coretemp' in temps:
            temp = temps['coretemp'][i].current if i < len(temps['coretemp']) else 0.0
            
        cpus.append({
            "cpu_id": i,
            "thread_usage": int(usage),
            "temperature": float(temp)
        })

    # 2. Statystyki GPU
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
    except: pass

    return {
        "status": True,
        "cpus": cpus,
        "gpus": gpus,
        "ram_usage": psutil.virtual_memory().percent
    }

'''
def get_gpu_stats():
    """
    Pobiera aktualne statystyki wszystkich dostępnych kart graficznych.
    
    Wyjście: 
    - List[Dict]: Lista słowników z kluczami: 'id', 'name', 'vram_total', 'vram_used', 'temp'.
    """
    try:
        pynvml.nvmlInit()
        device_count = pynvml.nvmlDeviceGetCount()
        stats = []
        for i in range(device_count):
            handle = pynvml.nvmlDeviceGetHandleByIndex(i)
            info = pynvml.nvmlDeviceGetMemoryInfo(handle)
            name = pynvml.nvmlDeviceGetName(handle)
            temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
            
            stats.append({
                "gpu_id": i,
                "model": name,
                "vram_total_mb": int(info.total / 1024**2),
                "vram_used_mb": int(info.used / 1024**2),
                "temperature": temp
            })
        return stats
    except Exception as e:
        return {"error": f"Błąd odczytu GPU: {str(e)}"}
        '''