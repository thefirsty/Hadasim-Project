using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Repository.Entities
{
    public class Supplier
    {
        public int SupplierId { get; set; }
        public string ContactName { get; set; }
        public string CompanyName { get; set; }
        public string Phone { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Product> Products { get; set; }



    }
}
