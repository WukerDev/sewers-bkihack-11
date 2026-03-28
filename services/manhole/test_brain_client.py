import grpc
import manhole_pb2
import manhole_pb2_grpc

def format_bytes(b):
    """Pomocnicza funkcja do czytelnego wyświetlania bajtów."""
    if b == 0: return "0 B"
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if b < 1024: return f"{b:.2f} {unit}"
        b /= 1024

def run():
    with grpc.insecure_channel('localhost:13000') as channel:
        stub = manhole_pb2_grpc.NodeMonitorStub(channel)
        
        # 1. JEDNORAZOWE POBRANIE INFO
        print("📥 Pobieram dane sprzętowe...")
        try:
            hw_info = stub.GetHardwareStaticInfo(manhole_pb2.Empty())
            print(f"✅ Połączono z Węzłem: {hw_info.node_id}")
            print(f"💻 Sprzęt: {hw_info.cpu_count} rdzeni, {hw_info.gpu_count} GPU, RAM: {format_bytes(hw_info.total_ram_bytes)}")
            print("-" * 50)

            # 2. STRUMIENIOWANIE
            print("📡 Rozpoczynam monitoring dynamiczny...")
            stats_stream = stub.StreamDynamicStats(manhole_pb2.Empty())
            
            for report in stats_stream:
                print(f"\n[Status: {report.status}] RAM użyte: {format_bytes(report.ram_used_bytes)}")
                
                for c in report.cpus:
                    print(f"  └─ CPU {c.cpu_id}: {c.usage_percent}% | {c.temperature}°C")
                
                for g in report.gpus:
                    # POPRAWKA: vram_used_bytes bierzemy z obiektu 'g', nie 'report'
                    print(f"  └─ GPU {g.gpu_id}: VRAM użyte: {format_bytes(g.vram_used_bytes)} | Load: {g.load_percent}% | {g.temperature}°C")

        except grpc.RpcError as e:
            print(f"❌ Błąd gRPC: {e.code()} - {e.details()}")

if __name__ == "__main__":
    run()