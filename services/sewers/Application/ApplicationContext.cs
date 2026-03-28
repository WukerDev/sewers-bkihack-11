using Microsoft.EntityFrameworkCore;
using sewers.Model;

namespace DefaultNamespace;

public class ApplicationContext : DbContext
{
    public DbSet<Manhole> Manholes { get; set; } = null!;
    public DbSet<Company> Companies { get; set; } = null!;

    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Company>()
            .HasMany(c => c.Manholes)
            .WithOne(m => m.Owner)
            .HasForeignKey(m => m.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Manhole>(entity =>
        {
            entity.HasMany(m => m.GPUs)
                .WithOne(g => g.Manhole)
                .HasForeignKey(g => g.ManholeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(m => m.CPUs)
                .WithOne(c => c.Manhole)
                .HasForeignKey(c => c.ManholeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.OwnsOne(m => m.WindowSchedule, builder =>
            {
                builder.ToJson();
                builder.OwnsOne(ws => ws.Monday);
                builder.OwnsOne(ws => ws.Tuesday);
                builder.OwnsOne(ws => ws.Wednesday);
                builder.OwnsOne(ws => ws.Thursday);
                builder.OwnsOne(ws => ws.Friday);
                builder.OwnsOne(ws => ws.Saturday);
                builder.OwnsOne(ws => ws.Sunday);
            });
        });
    }
}