using Microsoft.Extensions.DependencyInjection;
using Repository.Repository;
using Service.Interfaces;
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

            services.AddScoped<IService<PostDto>, PostService>();

            services.AddScoped<IService<FollowerDto>, FollowerService>();

            services.AddScoped<IService<CommentDto>, CommentService>();

            services.AddScoped<IService<ChatMessageDto>, ChatMessageService>();

            services.AddAutoMapper(typeof(MyMapper));

            return services;
        }
    }
}
