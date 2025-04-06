using Common.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using Service.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Grocery.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private readonly IService<SupplierDto> _supplierService;

        public SupplierController(IService<SupplierDto> supplierService)
        {
            _supplierService = supplierService;

        }
        // GET: api/<SupplierController>
        [HttpGet]
        [Authorize(Roles = "Admin")]

        public IActionResult Get()
        {
            try
            {
                var suppliers = _supplierService.GetAll();
                if (suppliers == null || !suppliers.Any())
                {
                    return NotFound("No suppliers found.");
                }
                return Ok(suppliers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET api/<SupplierController>/5
        [HttpGet("{id}")]
        [Authorize]

        public IActionResult GetById(int id)
        {
            try
            {


                if (id <= 0)
                {
                    return BadRequest("Invalid supplier ID.");
                }

                var supplier = _supplierService.GetById(id);
                if (supplier == null)
                {
                    return NotFound($"supplier with ID {id} not found.");
                }

                return Ok(supplier);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST api/<SupplierController>
        [HttpPost]
        public IActionResult Post([FromForm] SupplierDto value)
        {
            try
            {
                if (value == null)
                {
                    return BadRequest("Invalid supplier data.");
                }

                _supplierService.Add(value);
                return Ok("supplier added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}
