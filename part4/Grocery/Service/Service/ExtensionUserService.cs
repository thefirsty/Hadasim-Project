using AutoMapper;
using Common.Dto;
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
    public class ExtensionUserService:IUserService
    {
        private readonly IUserRepository _extensionUserRepository;
        private readonly IMapper _mapper;

        public ExtensionUserService(IUserRepository extensionUserRepository, IMapper mapper)
        {

            _extensionUserRepository = extensionUserRepository;
            _mapper = mapper;
        }

        public UserDto GetUserByEmail(string email)
        {
            return _mapper.Map<UserDto>(_extensionUserRepository.GetUserByEmail(email));
        }
    }
}
