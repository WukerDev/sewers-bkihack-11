namespace sewers.Application.State;

public class ManholeState
{
    public Guid Id { get; set; }
    public List<GpuUsage> GpuUsage { get; set; }
    public List<CpuUsage> CpuUsage { get; set; }
    public List<CpuDTO> Cpu { get; set; }
    public List<GpuDTO> GpuDTO { get; set; }
    public double Ram { get; set; }
    public double RamUsage { get; set; }
    public string State { get; set; }
}