using System.Collections.Concurrent;

namespace sewers.Application.State;

public class ApplicationState
{ 
    public ConcurrentBag<ManholeState> ManholeStates { get; set; }
}