using Microsoft.EntityFrameworkCore;
using WorldCities.Server.Controllers;
using WorldCities.Server.Data;
using WorldCities.Server.Data.Models;

namespace WorldCities.Server.Tests;

public class CititesController_Tests
{
    [Fact]
    public async Task GetCity()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "WorldCities")
            .Options;
        using var context = new ApplicationDbContext(options);
        context.Add(new City
        {
            Id = 1,
            Name = "TestCity1",
            CountryId = 1,
            Latitude = 1,
            Longitude = 1
        });
        await context.SaveChangesAsync();
        var controller = new CitiesController(context);
        City? city_existing = null;
        City? city_notexisting = null;

        city_existing = (await controller.GetCity(1)).Value;
        city_notexisting = (await controller.GetCity(999)).Value;

        Assert.NotNull(city_existing);
        Assert.Null(city_notexisting);
    }
}
