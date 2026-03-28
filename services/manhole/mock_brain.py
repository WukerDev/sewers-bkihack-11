import grpc
from concurrent import futures
import manhole_pb2
import manhole_pb2_grpc

class HeartbeatServicer(manhole_pb2_grpc.HeartbeatServicer):
    def Heartbeat(self, request, context):
        print("-" * 50)
        print(f"📥 RAPORT OD WĘZŁA: {request.id}")
        print(f"📊 Status: {'Aktywny' if request.status else 'Błąd'}")
        print(f"🧠 RAM: {request.ram_usage:.1f}%")
        
        # Wyświetlanie danych o wielu CPU
        print(f"🖥️  CPU ({len(request.cpus)} rdzeni):")
        for cpu in request.cpus:
            print(f"   [CPU {cpu.cpu_id}] Zużycie: {cpu.thread_usage}% | Temp: {cpu.temperature}°C")
        
        # Wyświetlanie danych o wielu GPU (jeśli są)
        if request.gpus:
            print(f"🎮 GPU ({len(request.gpus)} jednostek):")
            for gpu in request.gpus:
                print(f"   [GPU {gpu.gpu_id}] VRAM: {gpu.vram_usage:.1f}% | Temp: {gpu.temperature}°C")
        else:
            print("🎮 GPU: Brak wykrytych jednostek NVIDIA")
        
        print("-" * 50)
        
        # Zwracamy sukces do Manhole
        return manhole_pb2.HeartbeatResponse(success=True)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    manhole_pb2_grpc.add_HeartbeatServicer_to_server(HeartbeatServicer(), server)
    server.add_insecure_port('[::]:13000')
    print("🧠 Mock Brain (Decision Engine) słucha na porcie 13000...")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()