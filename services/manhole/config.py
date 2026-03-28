import os
import uuid

# Parametry połączenia z "Brain"
API_KEY = os.getenv("API_KEY", "default-dev-key")
#ORCHESTRATOR_URL = os.getenv("ORCHESTRATOR_URL", "https://api.gniazdo.ai")
ORCHESTRATOR_URL = os.getenv("ORCHESTRATOR_URL", "http://localhost:8000")

# Unikalny identyfikator Twojego węzła (id z .proto)
# Możesz go wziąć z env, a jeśli go nie ma - wygenerować losowy
NODE_ID = os.getenv("NODE_ID", str(uuid.uuid4())) 

# Adres Gatewaya (zgodnie z frontend.json)
GATEWAY_URL = 'localhost:13000' # Port sewersCluster

# Ścieżki lokalne wewnątrz kontenera Manhole
DATA_DIR = "/tmp/sewers/data"  # Tu lądują datasety
OUTPUT_DIR = "/tmp/sewers/output" # Tu lądują wyniki (wagi modelu)

# Interwał sprawdzania zadań (w sekundach)
POLLING_INTERVAL = 10
HEARTBEAT_INTERVAL = 30