using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Dto
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public int SupplierId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<OrderItemDto> Products { get; set; }

    }
}
