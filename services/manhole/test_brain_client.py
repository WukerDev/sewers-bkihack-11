import grpc
import manhole_pb2
import manhole_pb2_grpc

def run_test_client():
    # Jeśli testujesz na tym samym kompie: 'localhost:13000'
    # Jeśli kolega się łączy: 'TWOJE_IP:13000'
    channel = grpc.insecure_channel('localhost:13000')
    stub = manhole_pb2_grpc.NodeMonitorStub(channel)
    
    print("📡 Nawiązywanie połączenia z Manhole...")
    try:
        # Wywołujemy StreamStats z pustym zapytaniem
        responses = stub.StreamStats(manhole_pb2.Empty())
        
        for report in responses:
            print(f"\n--- Raport od {report.id[:8]} ---")
            print(f"Status: {report.status} | RAM: {report.ram_usage:.1f}%")
            print(f"CPUs: {len(report.cpus)} rdzeni | GPUs: {len(report.gpus)} jednostek")
            
            if report.cpus:
                avg_cpu = sum(c.thread_usage for c in report.cpus) / len(report.cpus)
                print(f"Średnie zużycie CPU: {avg_cpu:.1f}%")

    except grpc.RpcError as e:
        print(f"❌ Błąd gRPC: {e.code()} - {e.details()}")

if __name__ == "__main__":
    run_test_client()