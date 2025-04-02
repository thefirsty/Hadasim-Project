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
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public ProductDto Get(int id)
        {
            throw new NotImplementedException();
        }

        public List<ProductDto> GetAll()
        {
            throw new NotImplementedException();
        }

        public ProductDto Update(ProductDto item, int id)
        {
            throw new NotImplementedException();
        }
    }
}
