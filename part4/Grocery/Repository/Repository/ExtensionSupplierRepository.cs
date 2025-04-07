using Repository.Entities;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repository
{
    public class ExtensionSupplierRepository : ISupplierRepository
    {
        private readonly IContext _context;

        public ExtensionSupplierRepository(IContext context)
        {
            _context = context;
        }
        public Supplier GetSupplierByUserId(int userId)
        {
            return _context.suppliers.FirstOrDefault(s => s.UserId == userId);
        }
    }
}
