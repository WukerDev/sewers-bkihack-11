namespace sewers.Application.State;

public class CpuDTO
{
    public Guid Id { get; set; }
    public int CpuId { get; set; }
    public string Model { get; set; }
    public int Threads { get; set; }
}