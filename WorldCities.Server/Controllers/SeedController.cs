using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System.Security;
using WorldCities.Server.Data;
using WorldCities.Server.Data.Models;

namespace WorldCities.Server.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
[Authorize(Roles = "Administrator")]
public class SeedController(
    ApplicationDbContext context,
    RoleManager<IdentityRole> roleManager,
    UserManager<ApplicationUser> userManager,
    IWebHostEnvironment env,
    IConfiguration configuration
    ) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> CreateDefaultUsers()
    {
        string role_RegisteredUser = "RegisteredUser";
        string role_Administrator = "Administrator";

        if (await roleManager.FindByNameAsync(role_RegisteredUser) == null)
        {
            await roleManager.CreateAsync(new IdentityRole(role_RegisteredUser));
        }

        if (await roleManager.FindByNameAsync(role_Administrator) == null)
        {
            await roleManager.CreateAsync(new IdentityRole(role_Administrator));
        }

        var addedUsers = new List<ApplicationUser>();
        var email_Admin = "admin@email.com";
        if (await userManager.FindByEmailAsync(email_Admin) == null)
        {
            var user_Admin = new ApplicationUser
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = email_Admin,
                Email = email_Admin
            };
            var password_Admin = configuration["DefaultPasswords:Administrator"];
            var result = await userManager.CreateAsync(user_Admin, password_Admin!);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user_Admin, role_Administrator);
                await userManager.AddToRoleAsync(user_Admin, role_RegisteredUser);

                user_Admin.EmailConfirmed = true;
                user_Admin.LockoutEnabled = false;

                addedUsers.Add(user_Admin);
            }
        }

        var email_User = "user@email.com";
        if(await userManager.FindByEmailAsync(email_User) == null)
        {
            var user_User = new ApplicationUser
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = email_User,
                Email = email_User
            };
            var password_User = configuration["DefaultPasswords:RegisteredUser"];
            var result = await userManager.CreateAsync(user_User, password_User!);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user_User, role_RegisteredUser);
                user_User.EmailConfirmed = true;
                user_User.LockoutEnabled = false;
                addedUsers.Add(user_User);
            }
        }

        if(addedUsers.Count > 0)
        {
            await context.SaveChangesAsync();
        }

        return new JsonResult(new
        {
            addedUsers.Count,
            Users = addedUsers
        });
    }


    [HttpGet]
    public async Task<ActionResult> Import()
    {
        // prevents non-development environments from running this method
        if (!env.IsDevelopment())
            throw new SecurityException("Not allowed");

        var path = Path.Combine(
                env.ContentRootPath,
                "Data/Source/worldcities.xlsx");

        using var stream = System.IO.File.OpenRead(path);
        using var excelPackage = new ExcelPackage(stream);

        // get the first worksheet
        ExcelPackage.License.SetNonCommercialPersonal("Temp");
        var worksheet = excelPackage.Workbook.Worksheets[0];

        // define how many rows we want to process 
        var nEndRow = worksheet.Dimension.End.Row;

        // initialize the record counters 
        var numberOfCountriesAdded = 0;
        var numberOfCitiesAdded = 0;

        // create a lookup dictionary 
        // containing all the countries already existing 
        // into the Database (it will be empty on first run).
        var countriesByName = context.Countries
            .AsNoTracking()
            .ToDictionary(x => x.Name, StringComparer.OrdinalIgnoreCase);

        // iterates through all rows, skipping the first one 
        for (int nRow = 2; nRow <= nEndRow; nRow++)
        {
            var row = worksheet.Cells[
                nRow, 1, nRow, worksheet.Dimension.End.Column];

            var countryName = row[nRow, 5].GetValue<string>();
            var iso2 = row[nRow, 6].GetValue<string>();
            var iso3 = row[nRow, 7].GetValue<string>();

            // skip this country if it already exists in the database
            if (countriesByName.ContainsKey(countryName))
                continue;

            // create the Country entity and fill it with xlsx data 
            var country = new Country
            {
                Name = countryName,
                Iso2 = iso2,
                Iso3 = iso3
            };

            // add the new country to the DB context 
            await context.Countries.AddAsync(country);

            // store the country in our lookup to retrieve its Id later on
            countriesByName.Add(countryName, country);

            // increment the counter 
            numberOfCountriesAdded++;
        }

        // save all the countries into the Database 
        if (numberOfCountriesAdded > 0)
            await context.SaveChangesAsync();

        // create a lookup dictionary
        // containing all the cities already existing 
        // into the Database (it will be empty on first run). 
        var cities = context.Cities
            .AsNoTracking()
            .ToDictionary(x => (
                x.Name,
                x.Latitude,
                x.Longitude,
                x.CountryId));

        // iterates through all rows, skipping the first one 
        for (int nRow = 2; nRow <= nEndRow; nRow++)
        {
            var row = worksheet.Cells[
                nRow, 1, nRow, worksheet.Dimension.End.Column];

            var name = row[nRow, 1].GetValue<string>();
            var lat = row[nRow, 3].GetValue<decimal>();
            var lon = row[nRow, 4].GetValue<decimal>();
            var countryName = row[nRow, 5].GetValue<string>();

            // retrieve country Id by countryName
            var countryId = countriesByName[countryName].Id;

            // skip this city if it already exists in the database
            if (cities.ContainsKey((
                Name: name,
                Latitude: lat,
                Longitude: lon,
                CountryId: countryId)))
                continue;

            // create the City entity and fill it with xlsx data 
            var city = new City
            {
                Name = name,
                Latitude = lat,
                Longitude = lon,
                CountryId = countryId
            };

            // add the new city to the DB context 
            context.Cities.Add(city);

            // increment the counter 
            numberOfCitiesAdded++;
        }

        // save all the cities into the Database 
        if (numberOfCitiesAdded > 0)
            await context.SaveChangesAsync();

        return new JsonResult(new
        {
            Cities = numberOfCitiesAdded,
            Countries = numberOfCountriesAdded
        });
    }
}
