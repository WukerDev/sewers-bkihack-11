namespace sewers.Model;

public class Cpu
{
    public Guid Id { get; set; }
    public int CpuId { get; set; }
    public string Model { get; set; } = string.Empty;
    public int Threads { get; set; }

    public Guid ManholeId { get; set; }
    public Manhole Manhole { get; set; } = null!;
}