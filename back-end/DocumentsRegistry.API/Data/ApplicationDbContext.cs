using DocumentsRegistry.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace DocumentsRegistry.API.Data;

public class ApplicationDbContext : DbContext
{
    public DbSet<DocumentEntity> Documents { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DocumentEntity>()
            .HasKey(u => u.RegistrationCode);

        modelBuilder.Entity<DocumentEntity>()
            .HasIndex(u => u.FileName)
            .IsUnique();

    }


}
