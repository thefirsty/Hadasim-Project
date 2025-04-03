using Common.Dto;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using Service.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Grocery.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IService<ProductDto> _productService;

        public ProductController(IService<ProductDto> productService)
        {
            _productService = productService;

        }
        // GET: api/<ProductController>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var products = _productService.GetAll();
                if (products == null || !products.Any())
                {
                    return NotFound("No products found.");
                }
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET api/<ProductController>/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {

                if (id <= 0)
                {
                    return BadRequest("Invalid product ID.");
                }

                var product = _productService.GetById(id);
                if (product == null)
                {
                    return NotFound($"product with ID {id} not found.");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST api/<ProductController>
        [HttpPost]
        public IActionResult Post([FromForm] ProductDto value)
        {
            try
            {
                if (value == null)
                {
                    return BadRequest("Invalid product data.");
                }

                _productService.Add(value);
                return Ok("product added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
