import pynvml

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