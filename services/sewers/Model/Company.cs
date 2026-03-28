namespace sewers.Model;

public class Company
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Manhole> Manholes { get; set; } = new List<Manhole>();
}