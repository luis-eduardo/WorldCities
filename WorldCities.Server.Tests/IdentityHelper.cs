using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace WorldCities.Server.Tests;

public static class IdentityHelper
{
    public static RoleManager<TIdentityRole> GetRoleManager<TIdentityRole>(
        IRoleStore<TIdentityRole> roleStore
        )
        where TIdentityRole : IdentityRole, new()
    {
        return new RoleManager<TIdentityRole>(
            roleStore,
            new IRoleValidator<TIdentityRole>[0],
            new UpperInvariantLookupNormalizer(),
            new Moq.Mock<IdentityErrorDescriber>().Object,
            new Moq.Mock<ILogger<RoleManager<TIdentityRole>>>().Object
            );
    }

    public static UserManager<TIdentityUser> GetUserManager<TIdentityUser>(
        IUserStore<TIdentityUser> userStore
        ) 
        where TIdentityUser : IdentityUser, new()
    {
        return new UserManager<TIdentityUser>(
            userStore,
            new Moq.Mock<IOptions<IdentityOptions>>().Object,
            new Moq.Mock<IPasswordHasher<TIdentityUser>>().Object,
            new IUserValidator<TIdentityUser>[0],
            new IPasswordValidator<TIdentityUser>[0],
            new UpperInvariantLookupNormalizer(),
            new Moq.Mock<IdentityErrorDescriber>().Object,
            new Moq.Mock<IServiceProvider>().Object,
            new Moq.Mock<ILogger<UserManager<TIdentityUser>>>().Object
            );
    }
}
