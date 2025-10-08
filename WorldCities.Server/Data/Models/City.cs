namespace WorldCities.Server.Data.Models;

public class City
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public int CountryId { get; set; }

    public Country? Country { get; set; }
}
