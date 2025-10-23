namespace WorldCities.Server.Data;

public class CityDTO
{
    public int? Id { get; set; }
    public string Name { get; set; } = null!;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public int CountryId { get; set; }
    public string? CountryName { get; set; } = null!;
}
