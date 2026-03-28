import grpc
from concurrent import futures
import time
import logging
import uuid
import hardware
import manhole_pb2
import manhole_pb2_grpc

NODE_ID = str(uuid.uuid4())
NODE_STATUS = "free"

class NodeMonitorServicer(manhole_pb2_grpc.NodeMonitorServicer):
    
    def GetHardwareStaticInfo(self, request, context):
        """Wysyła info o sprzęcie raz na prośbę klienta."""
        logging.info(f"📊 Mózg prosi o dane statystyczne węzła {NODE_ID}")
        stats = hardware.get_full_stats()
        
        return manhole_pb2.HardwareStaticInfo(
            node_id=NODE_ID,
            total_ram_bytes=stats['total_ram'], # hardware.py musi to zwracać
            cpu_count=len(stats['cpus']),
            gpu_count=len(stats['gpus'])
        )

    def StreamDynamicStats(self, request, context):
        """Strumieniuje zużycie co sekundę."""
        logging.info("🔗 Mózg rozpoczął monitorowanie dynamiczne.")
        
        while context.is_active():
            try:
                stats = hardware.get_full_stats()
                
                response = manhole_pb2.DynamicStatsResponse(
                    status=NODE_STATUS,
                    ram_used_bytes=stats['ram_used_bytes'] # hardware.py musi to zwracać
                )
                
                for c in stats['cpus']:
                    cpu_item = response.cpus.add()
                    cpu_item.cpu_id = c['cpu_id']
                    cpu_item.usage_percent = c['thread_usage'] # To jest teraz średnia z socketu
                    cpu_item.temperature = c['temperature']

                for g in stats['gpus']:
                    gpu = response.gpus.add()
                    gpu.gpu_id = g['gpu_id']
                    gpu.vram_used_bytes = g['vram_used_bytes']
                    gpu.load_percent = g['load_percent'] # potrzebne w hardware.py
                    gpu.temperature = g['temperature']

                yield response
                time.sleep(1) # Dokładnie co sekundę
                
            except Exception as e:
                logging.error(f"❌ Błąd: {e}")
                break

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    manhole_pb2_grpc.add_NodeMonitorServicer_to_server(NodeMonitorServicer(), server)
    server.add_insecure_port('[::]:13000')
    server.start()
    logging.info("🚀 Serwer Manhole gotowy na porcie 13000")
    server.wait_for_termination()

if __name__ == "__main__":
    main()