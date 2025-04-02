using AutoMapper;
using Common.Dto;
using Repository.Entities;
using Repository.Interfaces;
using Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Service
{
    public class OrderItemService:IService<OrderItemDto>
    {
        private readonly IRepository<OrderItem> _repository;
        private readonly IMapper _mapper;

        public OrderItemService(IRepository<OrderItem> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public OrderItemDto Add(OrderItemDto item)
        {
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public OrderItemDto Get(int id)
        {
            throw new NotImplementedException();
        }

        public List<OrderItemDto> GetAll()
        {
            throw new NotImplementedException();
        }

        public OrderItemDto Update(OrderItemDto item, int id)
        {
            throw new NotImplementedException();
        }
    }
}
