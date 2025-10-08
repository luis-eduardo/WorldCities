using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WorldCities.Server.Data.Models;

namespace WorldCities.Server.Data.Config;

public class CountryEntityTypeConfig : IEntityTypeConfiguration<Country>
{
    public void Configure(EntityTypeBuilder<Country> builder)
    {
        builder.ToTable("Countries");
        ConfigureIndexes(builder);

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).IsRequired();
    }

    private static void ConfigureIndexes(EntityTypeBuilder<Country> builder)
    {
        builder.HasIndex(c => c.Name);
        builder.HasIndex(c => c.Iso2);
        builder.HasIndex(c => c.Iso3);
    }
}
