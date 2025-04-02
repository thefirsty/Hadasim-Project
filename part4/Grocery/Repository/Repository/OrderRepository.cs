using Repository.Entities;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repository
{
    public class OrderRepository : IRepository<Order>
    {
        private readonly IContext _context;

        public OrderRepository(IContext context) 
        { 
            _context = context;
        }

        public Order Add(Order item)
        {
            _context.orders.Add(item);
            _context.Save();
            return item;
        }

        public void Delete(int orderId)
        {
            var order = GetById(orderId);
            if (order != null)
            {
                _context.orders.Remove(order);
                _context.Save();
            }
        }

        public List<Order> GetAll()
        {
            return _context.orders.ToList();
        }

        public Order GetById(int orderId)
        {
            return _context.orders.FirstOrDefault(x => x.OrderId == orderId);
        }

        public Order Update(Order item, int orderId)
        {
            var existingOrder = GetById(orderId);
            if (existingOrder == null)

            {
                throw new Exception($"Order with ID {item.OrderId} not found.");
            }

            existingOrder.Status = item.Status;
            

            _context.orders.Update(existingOrder);

            _context.Save();

            return existingOrder;
        }
    }
}
