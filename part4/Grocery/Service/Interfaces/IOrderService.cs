using Common.Dto;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IOrderService
    {
        public List<OrderDto> GetOrdersBySupplierId(int supplierId);
       
    }
}
