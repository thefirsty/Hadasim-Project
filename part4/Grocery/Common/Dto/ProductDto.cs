using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Dto
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public int SupplierId { get; set; }
        public string ProductName { get; set; }
        public double UnitPrice { get; set; }
        public int MinOrderQuantity { get; set; }

    }
}
