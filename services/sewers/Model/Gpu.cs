namespace sewers.Model;

public class Gpu
{
    public Guid Id { get; set; }
    public int GpuId { get; set; }
    public string Model { get; set; } = string.Empty;
    public double Vram { get; set; }

    public Guid ManholeId { get; set; }
    public Manhole Manhole { get; set; } = null!;
}