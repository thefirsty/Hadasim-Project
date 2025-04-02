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
    public class ProductService: IService<ProductDto>
    {
        private readonly IRepository<Product> _repository;
        private readonly IMapper _mapper;

        public ProductService(IRepository<Product> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public ProductDto Add(ProductDto item)
        {
            var entity = _mapper.Map<Product>(item);
            return _mapper.Map<ProductDto>(_repository.Add(entity));
        }

        public void Delete(int productId)
        {
            _repository.Delete(productId);
        }

        public ProductDto GetById(int productId)
        {
            return _mapper.Map<ProductDto>(_repository.GetById(productId));
        }

        public List<ProductDto> GetAll()
        {
            return _mapper.Map<List<ProductDto>>(_repository.GetAll());
        }

        public ProductDto Update(ProductDto item, int productId)
        {
            var entity = _mapper.Map<Product>(item);
            return _mapper.Map<ProductDto>(_repository.Update(entity, productId));
        }
    }
}
