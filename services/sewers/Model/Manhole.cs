namespace sewers.Model;

public class Manhole
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public Guid OwnerId { get; set; }
    public Company Owner { get; set; } = null!;

    public ICollection<Gpu> GPUs { get; set; } = new List<Gpu>();
    public ICollection<Cpu> CPUs { get; set; } = new List<Cpu>();

    public double RAM { get; set; }
    
    public WindowSchedule WindowSchedule { get; set; } = new WindowSchedule();
    
    public double CityLongitude { get; set; }
    public double CityLatitude { get; set; }
    public string CityName { get; set; } = string.Empty;
    public double PricePerTeraflop { get; set; }
    public string Address { get; set; } = string.Empty;
}