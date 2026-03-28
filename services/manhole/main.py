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
        
        # Tworzymy obiekt odpowiedzi
        response = manhole_pb2.HardwareStaticInfo(
            node_id=NODE_ID,
            total_ram_bytes=int(stats['total_ram']),
            cpu_sockets_count=len(stats['cpus']) # ZMIANA: dopasowanie do .proto
        )
        
        # Dodajemy statyczne info o każdej karcie GPU (np. jej Max VRAM)
        for g in stats['gpus']:
            gpu_static = response.gpus.add()
            gpu_static.gpu_id = g['gpu_id']
            gpu_static.total_vram_bytes = int(g['vram_total_bytes'])
            
        return response

    def StreamDynamicStats(self, request, context):
        """Strumieniuje zużycie co sekundę."""
        logging.info("🔗 Mózg rozpoczął monitorowanie dynamiczne.")
        
        while context.is_active():
            try:
                stats = hardware.get_full_stats()
                
                # Budujemy odpowiedź - sprawdź czy pola pasują do .proto!
                response = manhole_pb2.DynamicStatsResponse(
                    status=NODE_STATUS,
                    ram_used_bytes=int(stats['ram_used_bytes'])
                )
                
                # CPU - używamy usage_percent zgodnie z Twoim .proto
                for c in stats['cpus']:
                    cpu = response.cpus.add()
                    cpu.cpu_id = c['cpu_id']
                    cpu.usage_percent = float(c['thread_usage']) # Sprawdź czy w .proto jest usage_percent!
                    cpu.temperature = float(c['temperature'])

                # GPU - używamy vram_used_bytes i temperature
                for g in stats['gpus']:
                    gpu = response.gpus.add()
                    gpu.gpu_id = g['gpu_id']
                    gpu.vram_used_bytes = int(g['vram_used_bytes'])
                    gpu.temperature = float(g['temperature'])

                yield response
                time.sleep(1)
                
            except Exception as e:
                logging.error(f"❌ Błąd w pętli serwera: {e}")
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