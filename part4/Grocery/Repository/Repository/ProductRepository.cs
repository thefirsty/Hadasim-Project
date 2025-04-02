using Repository.Entities;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repository
{
    public class ProductRepository : IRepository<Product>
    {
        private readonly IContext _context;
        public ProductRepository(IContext context) 
        { 
            _context=context;
        }
        public Product Add(Product item)
        {
            _context.products.Add(item);
            _context.Save();
            return item;
        }

        public void Delete(int productId)
        {
            var product = GetById(productId);
            if (product != null)
            {
                _context.products.Remove(product);
                _context.Save();
            }
        }

        public List<Product> GetAll()
        {
            return _context.products.ToList();
        }

        public Product GetById(int productId)
        {
            return _context.products.FirstOrDefault(x => x.ProductId == productId);
        }

        public Product Update(Product item, int productId)
        {
            var existingProduct = GetById(productId);
            if (existingProduct == null)

            {
                throw new Exception($"Product with ID {item.ProductId} not found.");
            }

            existingProduct.UnitPrice = item.UnitPrice;
            existingProduct.MinOrderQuantity = item.MinOrderQuantity;
            existingProduct.ProductName = item.ProductName;

            _context.products.Update(existingProduct);

            _context.Save();

            return existingProduct;
        }
    }
}



     



