using Repository.Entities;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repository
{
    public class ExtensionUserRepository:IUserRepository
    {
        private readonly IContext _context;
        public ExtensionUserRepository(IContext context)
        {
            _context = context;
        }
        public User GetUserByEmail(string email)
        {
            return _context.users.FirstOrDefault(p => p.Email == email);
        }
    }
}
