using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyLiverpool.Data.ResourceAccess;

namespace MyLfc.Common.Web.Middlewares
{
    public static class DbContextExtensions
    {
        public static IServiceCollection AddCustomDbContext(this IServiceCollection services, IConfiguration configuration  )
        { 
            services.AddDbContext<LiverpoolContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
              //  options.UseOpenIddict<int>();
            });

            return services;
        }
    }
}
