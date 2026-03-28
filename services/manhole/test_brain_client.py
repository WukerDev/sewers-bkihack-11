import grpc
import manhole_pb2
import manhole_pb2_grpc

def format_bytes(b):
    if b == 0: return "0 B"
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if b < 1024: return f"{b:.2f} {unit}"
        b /= 1024

def run():
    with grpc.insecure_channel('localhost:15000') as channel:
        stub = manhole_pb2_grpc.NodeMonitorStub(channel)
        
        print("📥 Pobieram dane sprzętowe...")
        hw = stub.GetHardwareStaticInfo(manhole_pb2.Empty())
        print(f"✅ Węzeł: {hw.node_id}")
        
        # Wyświetlanie zgodnie z Twoimi klasami C#
        for c in hw.cpus:
            print(f"💻 CPU {c.cpu_id}: {c.model} | Wątki: {c.threads}")
            
        for g in hw.gpus:
            print(f"🎮 GPU {g.gpu_id}: {g.model} | VRAM: {g.vram_gb:.2f} GB")
            
        print("-" * 50)

        print("📡 Monitoring dynamiczny...")
        for report in stub.StreamDynamicStats(manhole_pb2.Empty()):
            print(f"\n[Status: {report.status}] RAM użyte: {format_bytes(report.ram_used_bytes)}")
            
            for c in report.cpus:
                print(f"  └─ CPU {c.cpu_id} (całość): {c.usage_percent:.1f}% | {c.temperature:.1f}°C")
            
            for g in report.gpus:
                print(f"  └─ GPU {g.gpu_id} VRAM użyte: {format_bytes(g.vram_used_bytes)} | {g.temperature:.1f}°C")

if __name__ == "__main__":
    run()