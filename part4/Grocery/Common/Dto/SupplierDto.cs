using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Dto
{
    public class SupplierDto
    {
        public int UserId { get; set; }
        public string Role { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public int SupplierId { get; set; }
        public string ContactName { get; set; }
        public string CompanyName { get; set; }
        public string Phone { get; set; }
    }
}
