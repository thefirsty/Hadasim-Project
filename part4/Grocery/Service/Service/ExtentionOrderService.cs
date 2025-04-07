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
    public class ExtentionOrderService:IOrderService
    {
        private readonly IRepository<Order> _repository;
        private readonly IMapper _mapper;

        public ExtentionOrderService(IRepository<Order> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<OrderDto> GetOrdersBySupplierId(int supplierId)
        {
            var orders = _repository.GetAll()
                                    .Where(o => o.SupplierId == supplierId)
                                    .ToList();
            return _mapper.Map<List<OrderDto>>(orders);
        }
    }
}
