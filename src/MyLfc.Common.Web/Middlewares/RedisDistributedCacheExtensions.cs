using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyLfc.Common.Web.DistributedCache;

namespace MyLfc.Common.Web.Middlewares
{
    public static class RedisDistributedCacheExtensions
    {
        public static IServiceCollection AddCustomRedisCache(this IServiceCollection services, IConfiguration configuration)
        {
            var redisConfig = configuration.GetSection("Redis");

            DistributedCacheManager.KeyPrefix = redisConfig?["Prefix"] ?? "";
            services.AddDistributedRedisCache(opts =>
            {
                opts.Configuration = redisConfig["Domain"] + ":" + redisConfig["Port"];
            });
            if (bool.Parse(redisConfig["Enabled"]))
            {
                services.AddTransient<IDistributedCacheManager, DistributedCacheManager>();
            }
            else
            {
                services.AddTransient<IDistributedCacheManager, DisabledCacheManager>();
            }

            return services;
        }
    }
}
