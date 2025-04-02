using Repository.Entities;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repository
{
    public class OrderItemRepository : IRepository<OrderItem>
    {
        private readonly IContext _context;

        public OrderItemRepository(IContext context)
        {
            _context = context;
        }
        public OrderItem Add(OrderItem item)
        {
            _context.orderItems.Add(item);
            _context.Save();
            return item;
        }

        public void Delete(int orderItemId)
        {
            var orderItem = GetById(orderItemId);
            if (orderItem != null)
            {
                _context.orderItems.Remove(orderItem);
                _context.Save();
            }
        }

        public List<OrderItem> GetAll()
        {
            return _context.orderItems.ToList();
        }

        public OrderItem GetById(int orderItemId)
        {
            return _context.orderItems.FirstOrDefault(x => x.OrderItemId == orderItemId);
        }

        public OrderItem Update(OrderItem item, int orderItemId)
        {
            var existingOrderItem = GetById(orderItemId);
            if (existingOrderItem == null)

            {
                throw new Exception($"Order item with ID {item.OrderItemId} not found.");
            }

            existingOrderItem.Quantity = item.Quantity;
            

            _context.orderItems.Update(existingOrderItem);

            _context.Save();

            return existingOrderItem;
        }
    }
}
