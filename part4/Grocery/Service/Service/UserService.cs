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
using Microsoft.AspNetCore.Identity;


namespace Service.Service
{
    public class UserService: IService<UserDto>
    {
        private readonly IRepository<User> _repository;
        private readonly IMapper _mapper;
        private readonly PasswordHasher<string> _passwordHasher;


        public UserService(IRepository<User> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
            _passwordHasher = new PasswordHasher<string>();

        }

        public UserDto Add(UserDto item)
        {
            var entity = _mapper.Map<User>(item);

            // הצפנת הסיסמה לפני השמירה
            entity.Password = _passwordHasher.HashPassword(null, item.Password);

            // שמירת המשתמש בבסיס הנתונים
            var savedEntity = _repository.Add(entity);

            return _mapper.Map<UserDto>(savedEntity);
        }

        public void Delete(int userId)
        {
            _repository.Delete(userId);
        }

        public UserDto GetById(int userId)
        {
            return _mapper.Map<UserDto>(_repository.GetById(userId));
        }

        public List<UserDto> GetAll()
        {
            return _mapper.Map<List<UserDto>>(_repository.GetAll());
        }

        public UserDto Update(UserDto item, int userId)
        {
            var entity = _mapper.Map<User>(item);
            return _mapper.Map<UserDto>(_repository.Update(entity, userId));
        }
    }
}
