using Grpc.Core;
using Sewers.Main.Generated;

namespace DefaultNamespace.Controllers;

public class DashboardServiceController : Sewers.Main.Generated.DashboardService.DashboardServiceBase
{
    public override Task<GetManholesResponse> GetManholes(GetManholesRequest request, ServerCallContext context)
    {
        return base.GetManholes(request, context);
    }

    public override Task<GetManholeDetailsResponse> GetManholeDetails(GetManholeDetailsRequest request, ServerCallContext context)
    {
        return base.GetManholeDetails(request, context);
    }
}