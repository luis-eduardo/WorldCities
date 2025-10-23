using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;
using WorldCities.Server.Data.Models;

namespace WorldCities.Server.Data.GraphQL;

public class Mutation
{
    [Serial]
    [Authorize(Roles = ["RegisteredUser"])]
    public async Task<City> AddCity(
        [Service] ApplicationDbContext context,
        CityDTO cityDTO
        )
    {
        var city = new City()
        {
            Name = cityDTO.Name,
            Latitude = cityDTO.Latitude,
            Longitude = cityDTO.Longitude,
            CountryId = cityDTO.CountryId
        };
        context.Cities.Add(city);
        await context.SaveChangesAsync();
        return city;
    }

    [Serial]
    [Authorize(Roles = ["RegisteredUser"])]
    public async Task<City> UpdateCity(
        [Service] ApplicationDbContext context,
        CityDTO cityDTO
        )
    {
        var city = await context.Cities
            .Where(c => c.Id == cityDTO.Id)
            .FirstOrDefaultAsync()
            ?? throw new NotSupportedException();

        city.Name = cityDTO.Name;
        city.Latitude = cityDTO.Latitude;
        city.Longitude = cityDTO.Longitude;
        city.CountryId = cityDTO.CountryId;
        context.Cities.Update(city);
        await context.SaveChangesAsync();
        return city;
    }

    [Serial]
    [Authorize(Roles = ["Administrator"])]
    public async Task<bool> DeleteCity(
        [Service] ApplicationDbContext context,
        int id
        )
    {
        var city = await context.Cities
            .Where(c => c.Id == id)
            .FirstOrDefaultAsync()
            ?? throw new NotSupportedException();

        context.Cities.Remove(city);
        await context.SaveChangesAsync();

        return true;
    }

    [Serial]
    [Authorize(Roles = ["RegisteredUser"])]
    public async Task<Country> AddCountry(
        [Service] ApplicationDbContext context,
        CountryDTO countryDTO
        )
    {
        var country = new Country()
        {
            Name = countryDTO.Name,
            Iso2 = countryDTO.Iso2,
            Iso3 = countryDTO.Iso3
        };
        context.Countries.Add(country);
        await context.SaveChangesAsync();
        return country;
    }

    [Serial]
    [Authorize(Roles = ["RegisteredUser"])]
    public async Task<Country> UpdateCountry(
        [Service] ApplicationDbContext context,
        CountryDTO countryDTO
        )
    {
        var country = await context.Countries
            .Where(c => c.Id == countryDTO.Id)
            .FirstOrDefaultAsync()
            ?? throw new NotSupportedException();

        country.Name = countryDTO.Name;
        country.Iso2 = countryDTO.Iso2;
        country.Iso3 = countryDTO.Iso3;
        context.Countries.Update(country);
        await context.SaveChangesAsync();
        return country;
    }

    [Serial]
    [Authorize(Roles = ["Administrator"])]
    public async Task<bool> DeleteCountry(
        [Service] ApplicationDbContext context,
        int id
        )
    {
        var country = await context.Countries
            .Where(c => c.Id == id)
            .FirstOrDefaultAsync()
            ?? throw new NotSupportedException();

        context.Countries.Remove(country);
        await context.SaveChangesAsync();

        return true;
    }
}
