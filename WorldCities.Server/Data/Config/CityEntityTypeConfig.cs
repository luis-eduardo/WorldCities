using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WorldCities.Server.Data.Models;

namespace WorldCities.Server.Data.Config;

public class CityEntityTypeConfig : IEntityTypeConfiguration<City>
{
    public void Configure(EntityTypeBuilder<City> builder)
    {
        builder.ToTable("Cities");
        ConfigureIndexes(builder);
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).IsRequired();

        builder.Property(c => c.Latitude)
            .HasColumnType("decimal(7,4)");
        builder.Property(c => c.Longitude)
            .HasColumnType("decimal(7,4)");

        builder.HasOne(c => c.Country)
            .WithMany(cntry => cntry.Cities)
            .HasForeignKey(c => c.CountryId);
    }

    private static void ConfigureIndexes(EntityTypeBuilder<City> builder)
    {
        builder.HasIndex(c => c.Name);
        builder.HasIndex(c => c.Latitude);
        builder.HasIndex(c => c.Longitude);
    }
}
