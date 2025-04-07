using Common.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Grocery.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IService<OrderDto> _orderService;
        private readonly IOrderService _extensionOrderService;


        public OrderController(IService<OrderDto> orderService, IOrderService extensionOrderService)
        {
            _orderService = orderService;
            _extensionOrderService = extensionOrderService;
        }
        // GET: api/<OrderController>
        [HttpGet]
        [Authorize(Roles = "Admin")]

        public IActionResult Get()
        {
            try
            {
                var orders = _orderService.GetAll();
                if (orders == null || !orders.Any())
                {
                    return NotFound("No orders found.");
                }
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

        // GET api/<OrderController>/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {

                if (id <= 0)
                {
                    return BadRequest("Invalid order ID.");
                }

                var order = _orderService.GetById(id);
                if (order == null)
                {
                    return NotFound($"order with ID {id} not found.");
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST api/<OrderController>
        [HttpPost]
        [Authorize(Roles = "Admin")]

        public IActionResult Post([FromBody] OrderDto value)
        {
            try
            {
                if (value == null)
                {
                    return BadRequest("Invalid order data.");
                }

                _orderService.Add(value);
                return Ok("order added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT api/<OrderController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromForm] OrderDto value)
        {
            try
            {
                

                if (id <= 0)
                {
                    return BadRequest("Invalid order ID.");
                }

                var existingOrder = _orderService.GetById(id);
                if (existingOrder == null)
                {
                    return NotFound($"Order with ID {id} not found.");
                }

                

                _orderService.Update(value, id);
                return Ok("Order updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/orders/by-supplier/5
        [HttpGet("by-supplier/{supplierId}")]
        public ActionResult<List<OrderDto>> GetOrdersBySupplierId(int supplierId)
        {
            var orders = _extensionOrderService.GetOrdersBySupplierId(supplierId);
            if (orders == null || orders.Count == 0)
                return NotFound($"No orders found for supplier ID {supplierId}");

            return Ok(orders);
        }

    }
}
