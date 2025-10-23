using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using WorldCities.Server.Data;
using WorldCities.Server.Data.Models;

namespace WorldCities.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(
        UserManager<ApplicationUser> userManager,
        JwtHandler jwtHandler) : ControllerBase
    {
        [HttpPost("Login")]
        public async Task<IActionResult> Login(ApiLoginRequest loginRequest)
        {
            var user = await userManager.FindByNameAsync(loginRequest.Email);

            var unauthorizedResult = Unauthorized(new ApiLoginResult()
            {
                Success = false,
                Message = "Invalid email or password."
            });

            if (user == null) {
                return unauthorizedResult;
            }

            var passwordValid = await userManager.CheckPasswordAsync(user, loginRequest.Password);

            if (!passwordValid) {
                return unauthorizedResult;
            }

            var token = await jwtHandler.GetTokenAsync(user);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new ApiLoginResult()
            {
                Success = true,
                Message = "Login successful",
                Token = jwt
            });
        }
    }
}
