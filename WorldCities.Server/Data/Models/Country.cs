namespace WorldCities.Server.Data.Models;

public class Country
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public required string Iso2 { get; set; }

    public required string Iso3 { get; set; }

    public ICollection<City>? Cities { get; set; }
}
