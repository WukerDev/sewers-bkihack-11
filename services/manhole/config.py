import os

# Parametry połączenia z "Brain"
API_KEY = os.getenv("API_KEY", "default-dev-key")
ORCHESTRATOR_URL = os.getenv("ORCHESTRATOR_URL", "https://api.gniazdo.ai")

# Ścieżki lokalne wewnątrz kontenera Manhole
DATA_DIR = "/tmp/sewers/data"  # Tu lądują datasety
OUTPUT_DIR = "/tmp/sewers/output" # Tu lądują wyniki (wagi modelu)

# Interwał sprawdzania zadań (w sekundach)
POLLING_INTERVAL = 10
HEARTBEAT_INTERVAL = 30