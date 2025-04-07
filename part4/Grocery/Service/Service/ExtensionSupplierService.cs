using AutoMapper;
using Common.Dto;
using Repository.Entities;
using Repository.Interfaces;
using Repository.Repository;
using Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Service
{
    public class ExtensionSupplierService : ISupplierService
    {
        private readonly ISupplierRepository _extensionSupplierRepository;
        private readonly IMapper _mapper;

        public ExtensionSupplierService(ISupplierRepository supplierRepository, IMapper mapper)
        {
            _extensionSupplierRepository = supplierRepository;
            _mapper = mapper;
        }
        public SupplierDto GetSupplierByUserId(int userId)
        {
            return _mapper.Map<SupplierDto>(_extensionSupplierRepository.GetSupplierByUserId(userId));
        }
    }
}
