using Repository.Entities;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repository
{
    public class UserRepository:IRepository<User>
    {
        private readonly IContext _context;

        public UserRepository(IContext context)
        {
            _context = context;
        }

        public User Add(User item)
        {
            _context.users.Add(item);
            _context.Save();
            return item;
        }

        public void Delete(int uderId)
        {
            var user = GetById(uderId);
            if (user != null)
            {
                _context.users.Remove(user);
                _context.Save();
            }
        }

        public List<User> GetAll()
        {
            return _context.users.ToList();
        }

        public User GetById(int userId)
        {
            return _context.users.FirstOrDefault(x => x.UserId == userId);
        }

        public User Update(User item, int userId)
        {
            var existingUser = GetById(userId);
            if (existingUser == null)

            {
                throw new Exception($"User with ID {item.UserId} not found.");
            }

            existingUser.Email = item.Email;
            existingUser.Password = item.Password;
            
            _context.users.Update(existingUser);

            _context.Save();

            return existingUser;
        }
    }
}



    
       





