using Repository.Entities;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repository
{
    public class SupplierRepository : IRepository<Supplier>
    {
        private readonly IContext _context;

        public SupplierRepository(IContext context)
        {
            _context = context;
        }
        public Supplier Add(Supplier item)
        {
            _context.suppliers.Add(item);
            _context.Save();
            return item;
        }

        public void Delete(int supplierId)
        {
            var supplier = GetById(supplierId);
            if (supplier != null)
            {
                _context.suppliers.Remove(supplier);
                _context.Save();
            }
        }

        public List<Supplier> GetAll()
        {
            return _context.suppliers.ToList();
        }

        public Supplier GetById(int supplierId)
        {
            return _context.suppliers.FirstOrDefault(x => x.SupplierId == supplierId);
        }

        public Supplier Update(Supplier item, int supplierId)
        {
            var existingSupplier = GetById(supplierId);
            if (existingSupplier == null)

            {
                throw new Exception($"Supplier with ID {item.SupplierId} not found.");
            }

            existingSupplier.Phone = item.Phone;
            existingSupplier.CompanyName = item.CompanyName;
            existingSupplier.ContactName = item.ContactName;

            _context.suppliers.Update(existingSupplier);

            _context.Save();

            return existingSupplier;
        }
    }
}

