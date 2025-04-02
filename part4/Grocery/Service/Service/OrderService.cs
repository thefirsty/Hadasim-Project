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
    public class OrderService:IService<OrderDto>
    {
        private readonly IRepository<Order> _repository;
        private readonly IMapper _mapper;

        public OrderService(IRepository<Order> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public OrderDto Add(OrderDto item)
        {
            var entity = _mapper.Map<Order>(item);
            return _mapper.Map<OrderDto>(_repository.Add(entity));
        }

        public void Delete(int orderId)
        {
            _repository.Delete(orderId);
        }

        public OrderDto GetById(int orderId)
        {
            return _mapper.Map<OrderDto>(_repository.GetById(orderId));
        }

        public List<OrderDto> GetAll()
        {
            return _mapper.Map<List<OrderDto>>(_repository.GetAll());
        }

        public OrderDto Update(OrderDto item, int orderId)
        {
            var entity = _mapper.Map<Order>(item);
            return _mapper.Map<OrderDto>(_repository.Update(entity, orderId));
        }
    }
}
