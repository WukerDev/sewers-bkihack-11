import grpc
from concurrent import futures
import time
import logging
import uuid
import hardware
# import config # odkomentuj, jeśli masz tam NODE_ID, inaczej użyjemy uuid poniżej

import manhole_pb2
import manhole_pb2_grpc

# Konfiguracja
NODE_ID = str(uuid.uuid4()) # Unikalne ID tego konkretnego węzła
NODE_STATUS = "free"

class NodeMonitorServicer(manhole_pb2_grpc.NodeMonitorServicer):
    """To jest serce Twojego serwera gRPC. Tu 'puchną' dane dla Mózgu."""
    
    def StreamStats(self, request, context):
        logging.info("🔗 Mózg (klient) podłączył się do strumienia.")
        
        while context.is_active():
            try:
                # 1. Pobieramy realne dane z hardware.py
                stats = hardware.get_full_stats()
                
                # 2. Budujemy odpowiedź zgodną z Twoim manhole.proto
                response = manhole_pb2.HeartbeatResponse(
                    id=NODE_ID,
                    status=NODE_STATUS,
                    ram_usage=stats['ram_usage']
                )
                
                # Dodajemy procesory (repeated cpus)
                for c in stats['cpus']:
                    cpu_item = response.cpus.add()
                    cpu_item.cpu_id = c['cpu_id']
                    cpu_item.thread_usage = int(c['thread_usage'])
                    cpu_item.temperature = float(c['temperature'])

                # Dodajemy karty graficzne (repeated gpus)
                for g in stats['gpus']:
                    gpu_item = response.gpus.add()
                    gpu_item.gpu_id = g['gpu_id']
                    gpu_item.vram_usage = float(g['vram_usage'])
                    gpu_item.temperature = float(g['temperature'])

                # 3. Yield wysyła paczkę przez rurę (streaming)
                yield response
                
                # Czekamy 2 sekundy przed kolejnym odczytem
                time.sleep(2)
                
            except Exception as e:
                logging.error(f"❌ Błąd strumieniowania: {e}")
                break
        
        logging.info("🔌 Mózg się rozłączył. Kończę nadawanie.")

def main():
    # Ustawiamy logowanie na konsolę
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logging.info(f"🚀 Sewers Manhole uruchomiony jako SERWER. ID: {NODE_ID}")
    
    # Tworzymy serwer gRPC
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # Rejestrujemy naszą usługę
    manhole_pb2_grpc.add_NodeMonitorServicer_to_server(NodeMonitorServicer(), server)
    
    # Słuchamy na wszystkich interfejsach na porcie 13000
    port = 13000
    server.add_insecure_port(f'[::]:{port}')
    
    server.start()
    logging.info(f"📡 Serwer gRPC nasłuchuje na porcie {port}...")
    
    try:
        # Serwer musi działać w tle, dopóki go nie zamkniemy (np. Ctrl+C)
        server.wait_for_termination()
    except KeyboardInterrupt:
        logging.info("🛑 Zatrzymywanie serwera...")
        server.stop(0)

if __name__ == "__main__":
    main()