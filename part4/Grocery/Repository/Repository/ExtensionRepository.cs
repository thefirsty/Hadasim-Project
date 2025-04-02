using Microsoft.Extensions.DependencyInjection;
using Repository.Entities;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repository
{
    public static class ExtensionRepository
    {
        public static IServiceCollection AddRepository(this IServiceCollection services)
        {
            services.AddScoped<IRepository<User>, UserRepository>();

            services.AddScoped<IRepository<Order>, OrderRepository>();

            services.AddScoped<IRepository<Product>, ProductRepository>();

            services.AddScoped<IRepository<OrderItem>, OrderItemRepository>();

            services.AddScoped<IRepository<Supplier>, SupplierRepository>();

            return services;
        }
    }
}
