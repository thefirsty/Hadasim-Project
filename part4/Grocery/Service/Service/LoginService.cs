using Common.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Service.Interfaces;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace Service.Services
{
    public class LoginService : ILoginService
    {
        private readonly IService<UserDto> _userService;
        private readonly IUserService _extensionUserService;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<string> _passwordHasher;


        public LoginService(IService<UserDto> userService, IUserService extensionUserService, IConfiguration configuration)
        {
            this._userService = userService;
            this._extensionUserService = extensionUserService;
            this._configuration = configuration;
            this._passwordHasher = new PasswordHasher<string>(); 

        }


        public string Authenticate(string email, string password)
        {
            try
            {
                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                {
                    throw new ArgumentException("Email and password must be provided.");
                }

                var user = _extensionUserService.GetUserByEmail(email);
                if (user == null)
                {
                    return null;
                }

                var result = _passwordHasher.VerifyHashedPassword(null, user.Password, password);
                if (result != PasswordVerificationResult.Success)
                {
                    return null;
                }

                return GenerateToken(user); 
            }
            catch (Exception ex)
            {
                throw new Exception($"Error during authentication: {ex.Message}");
            }
        }


        private string GenerateToken(UserDto user)
        {
            try
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var claims = new[]
                {
                    new Claim(ClaimTypes.Role, user.Role),                   
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                };


                var token = new JwtSecurityToken(
                    _configuration["Jwt:Issuer"],
                    _configuration["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddDays(1),
                    signingCredentials: credentials);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error generating JWT token: {ex.Message}");
            }
        }
    }
}

