using Common.Dto;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;

namespace SportNetwork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        // POST api/login
        [HttpPost]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                {
                    return BadRequest("Email and password are required.");
                }

                var token = _loginService.Authenticate(loginDto.Email, loginDto.Password);
                if (token == null)
                {
                    return Unauthorized("User does not exist or incorrect credentials.");
                }

                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
