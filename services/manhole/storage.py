import requests
import hashlib
import os
import logging

def download_dataset(url, destination):
    """Pobiera plik z obsługą błędów."""
    try:
        os.makedirs(os.path.dirname(destination), exist_ok=True)
        response = requests.get(url, stream=True, timeout=10)
        response.raise_for_status() # Rzuć błąd jeśli 404 lub 500
        
        with open(destination, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        logging.error(f"❌ Błąd pobierania danych z {url}: {e}")
        return False

def calculate_checksum(file_path):
    """Generuje hash SHA256 lub zwraca None jeśli plik nie istnieje."""
    if not os.path.exists(file_path):
        return None
        
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()