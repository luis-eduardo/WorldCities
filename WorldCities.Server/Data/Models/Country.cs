using System.Text.Json.Serialization;

namespace WorldCities.Server.Data.Models;

public class Country
{
    public int Id { get; set; }

    public required string Name { get; set; }

    [JsonPropertyName("iso2")]
    public required string Iso2 { get; set; }

    [JsonPropertyName("iso3")]
    public required string Iso3 { get; set; }

    public ICollection<City>? Cities { get; set; }
}
