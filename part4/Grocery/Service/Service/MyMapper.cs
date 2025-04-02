using AutoMapper;
using Common.Dto;
using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Service
{
    public class MyMapper :Profile
    {
        public MyMapper()
        {
  
            CreateMap<User, UserDto>().ReverseMap();

            CreateMap<Product, ProductDto>().ReverseMap();

            CreateMap<Supplier, SupplierDto>().ReverseMap();

            CreateMap<Order, OrderDto>().ReverseMap();

            CreateMap<OrderItem, OrderItemDto>().ReverseMap();
   
        }
    }
}
