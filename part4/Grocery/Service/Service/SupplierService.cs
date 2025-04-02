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
    public class SupplierService: IService<SupplierDto>
    {
        private readonly IRepository<Supplier> _repository;
        private readonly IMapper _mapper;

        public SupplierService(IRepository<Supplier> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public SupplierDto Add(SupplierDto item)
        {
            throw new NotImplementedException();
        }

        public void Delete(int supplierId)
        {
            throw new NotImplementedException();
        }

        public SupplierDto GetById(int supplierId)
        {
            throw new NotImplementedException();
        }

        public List<SupplierDto> GetAll()
        {
            throw new NotImplementedException();
        }

        public SupplierDto Update(SupplierDto item, int supplierId)
        {
            var entity = _mapper.Map<User>(item);
            return _mapper.Map<UserDto>(_repository.Update(entity, supplierId));
        }
    }
}
