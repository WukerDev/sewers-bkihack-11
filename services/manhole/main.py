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
        stats = hardware.get_full_stats()
        response = manhole_pb2.HardwareStaticInfo(
            node_id=NODE_ID,
            total_ram_bytes=int(stats['total_ram'])
        )

        for c in stats['cpus']:
            cpu = response.cpus.add()
            cpu.cpu_id = c['cpu_id']
            cpu.model = c['model']
            cpu.threads = c['threads']

        for g in stats['gpus']:
            gpu = response.gpus.add()
            gpu.gpu_id = g['gpu_id']
            gpu.model = g['model']
            # Konwersja na GB (double) dla klasy Gpu w C#
            gpu.vram_gb = g['vram_total_bytes'] / (1024**3)

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
    port = 15000
    server.add_insecure_port(f'[::]:{port}')
    server.start()
    logging.info(f"🚀 Serwer Manhole gotowy na porcie {port}")
    server.wait_for_termination()

if __name__ == "__main__":
    main()