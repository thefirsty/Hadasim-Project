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

            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.OrderItems))
                .ReverseMap()
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.Products));

            CreateMap<OrderItem, OrderItemDto>().ReverseMap();
   
        }
    }
}
