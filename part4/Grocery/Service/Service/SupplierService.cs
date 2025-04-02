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
            var entity = _mapper.Map<Supplier>(item);
            return _mapper.Map<SupplierDto>(_repository.Add(entity));
        }

        public void Delete(int supplierId)
        {
            _repository.Delete(supplierId);
        }

        public SupplierDto GetById(int supplierId)
        {
            return _mapper.Map<SupplierDto>(_repository.GetById(supplierId));
        }

        public List<SupplierDto> GetAll()
        {
            return _mapper.Map<List<SupplierDto>>(_repository.GetAll());
        }

        public SupplierDto Update(SupplierDto item, int supplierId)
        {
            var entity = _mapper.Map<Supplier>(item);
            return _mapper.Map<SupplierDto>(_repository.Update(entity, supplierId));
        }
    }
}
