using System.Text.Json.Serialization;

namespace WorldCities.Server.Data;

public class CountryDTO
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    [JsonPropertyName("iso2")]
    public string Iso2 { get; set; } = null!;

    [JsonPropertyName("iso3")]
    public string Iso3 { get; set; } = null!;

    public int? TotCities { get; set; } = null!;
}
