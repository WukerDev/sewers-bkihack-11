import requests
import hashlib
import os

def download_dataset(url, destination):
    """Pobiera plik datasetu z podanego URL."""
    response = requests.get(url, stream=True)
    with open(destination, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

def calculate_checksum(file_path):
    """
    Generuje hash SHA256 pliku wynikowego (wag modelu).
    Służy do weryfikacji redundancji (x=1, x=2...).
    """
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()