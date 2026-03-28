namespace sewers.Application.State;

public class CpuUsage
{
    public Guid Id { get; set; }
    public double Temperature { get; set; }
    public double ThreadUsage  { get; set; }
}