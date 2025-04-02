using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Dto
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Role { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
