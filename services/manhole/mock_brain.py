import grpc
from concurrent import futures
import manhole_pb2
import manhole_pb2_grpc

class HeartbeatServicer(manhole_pb2_grpc.HeartbeatServicer):
    def Heartbeat(self, request, context):
        print(f"📥 Otrzymano Heartbeat od: {request.id}")
        print(f"💻 RAM: {request.ram_usage}% | CPUs: {len(request.cpus)}")
        return manhole_pb2.HeartbeatResponse(success=True)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    manhole_pb2_grpc.add_HeartbeatServicer_to_server(HeartbeatServicer(), server)
    server.add_insecure_port('[::]:13000')
    print("🧠 Mock Brain słucha na porcie 13000...")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()