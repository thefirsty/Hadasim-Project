using Common.Dto;
using Microsoft.Extensions.DependencyInjection;
using Repository.Repository;
using Service.Interfaces;
using Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Service
{
    public static class ExtensionService
    {
        public static IServiceCollection AddServiceExtension(this IServiceCollection services)
        {

            services.AddRepository();

            services.AddScoped<IService<UserDto>, UserService>();

            services.AddScoped<IUserService, ExtensionUserService>();

            services.AddScoped<IService<SupplierDto>, SupplierService>();

            services.AddScoped<IService<ProductDto>, ProductService>();

            services.AddScoped<IService<OrderDto>, OrderService>();

            services.AddScoped<IService<OrderItemDto>, OrderItemService>();

            services.AddScoped<IOrderService, ExtentionOrderService>();

            services.AddScoped<IService<OrderItemDto>, OrderItemService>();

            services.AddScoped<ILoginService, LoginService>();


            services.AddAutoMapper(typeof(MyMapper));

            return services;
        }
    }
}
