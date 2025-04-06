using Common.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using Service.Service;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Grocery.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private readonly IService<OrderItemDto> _orderItemService;

        public OrderItemController(IService<OrderItemDto> orderItemService)
        {
            _orderItemService = orderItemService;

        }
        // GET: api/<OrderItemController>
        [HttpGet]

        public IActionResult Get()
        {
            try
            {
                var orderItems = _orderItemService.GetAll();
                if (orderItems == null || !orderItems.Any())
                {
                    return NotFound("No order items found.");
                }
                return Ok(orderItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET api/<OrderItemController>/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {

                if (id <= 0)
                {
                    return BadRequest("Invalid order item ID.");
                }

                var orderItem = _orderItemService.GetById(id);
                if (orderItem == null)
                {
                    return NotFound($"order item with ID {id} not found.");
                }

                return Ok(orderItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST api/<OrderItemController>
        [HttpPost]
        [Authorize(Roles = "Admin")]

        public IActionResult Post([FromForm] OrderItemDto value)
        {
            try
            {

                if (value == null)
                {
                    return BadRequest("Invalid order item data.");
                }

                _orderItemService.Add(value);
                return Ok("order item added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
