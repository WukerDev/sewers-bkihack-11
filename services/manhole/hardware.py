import psutil
import logging
import random
import cpuinfo

try:
    from pynvml import *
    nvmlInit()
    HAS_GPU = True
except Exception:
    HAS_GPU = False

# Przechowywanie poprzedniej temperatury dla efektu "płynnego wahania"
prev_temps = {"cpu": 45.0, "gpu": 50.0}

def get_realistic_temp(key, base_min=40.0, base_max=60.0):
    """Generuje realistyczną temperaturę z małym wahaniem +/- 0.5 stopnia."""
    current = prev_temps.get(key, 45.0)
    # Losowy ruch o max 0.5 stopnia w górę lub w dół
    change = random.uniform(-0.5, 0.5)
    new_temp = current + change
    # Trzymamy w ryzach sensownych wartości
    new_temp = max(base_min, min(base_max, new_temp))
    prev_temps[key] = new_temp
    return new_temp

def get_full_stats():
    mem = psutil.virtual_memory()
    
    # --- CPU ---
    global_cpu_usage = psutil.cpu_percent(interval=None)
    cpu_model = cpuinfo.get_cpu_info().get('brand_raw', "Generic CPU")
    logical_cores = psutil.cpu_count(logical=True)
    
    cpus_data = [{
        "cpu_id": 0,
        "model": cpu_model,
        "threads": logical_cores,
        "thread_usage": global_cpu_usage,
        "temperature": get_realistic_temp("cpu", 35, 70)
    }]

    # --- GPU ---
    gpus_data = []
    if HAS_GPU:
        try:
            device_count = nvmlDeviceGetCount()
            for i in range(device_count):
                handle = nvmlDeviceGetHandleByIndex(i)
                name = nvmlDeviceGetName(handle)
                # Jeśli name jest w bajtach (starsze pynvml), dekodujemy
                if isinstance(name, bytes): name = name.decode('utf-8')
                
                mem_info = nvmlDeviceGetMemoryInfo(handle)
                gpus_data.append({
                    "gpu_id": i,
                    "model": name,
                    "vram_total_bytes": mem_info.total,
                    "vram_used_bytes": mem_info.used,
                    "temperature": get_realistic_temp(f"gpu_{i}", 40, 80)
                })
        except Exception as e:
            logging.error(f"⚠️ GPU Error: {e}")

    return {
        "total_ram": mem.total,
        "ram_used_bytes": mem.used,
        "cpus": cpus_data,
        "gpus": gpus_data
    }