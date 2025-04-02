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
            var entity = _mapper.Map<OrderItem>(item);
            return _mapper.Map<OrderItemDto>(_repository.Add(entity));
        }

        public void Delete(int orderItemId)
        {
            _repository.Delete(orderItemId);
        }

        public OrderItemDto GetById(int orderItemId)
        {
            return _mapper.Map<OrderItemDto>(_repository.GetById(orderItemId));
        }

        public List<OrderItemDto> GetAll()
        {
            return _mapper.Map<List<OrderItemDto>>(_repository.GetAll());
        }

        public OrderItemDto Update(OrderItemDto item, int orderItemId)
        {
            var entity = _mapper.Map<OrderItem>(item);
            return _mapper.Map<OrderItemDto>(_repository.Update(entity, orderItemId));
        }
    }
}
