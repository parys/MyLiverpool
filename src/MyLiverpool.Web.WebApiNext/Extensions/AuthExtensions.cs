using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace MyLiverpool.Web.WebApiNext.Extensions
{
    public static class AuthExtensions
    {
        public static IServiceCollection AddAuthorizationAndAuthentication(this IServiceCollection services, IConfiguration config)
        {
            services.AddAuthorization();

            var authSection = config.GetSection("Auth");
            services.TryAddSingleton(new IdentityServerAuthenticationOptions
            {
                Authority = authSection["Authority"],
                RequireHttpsMetadata = false,
                ApiName = config.GetValue<string>("ApiName"),
                ApiSecret = config.GetValue<string>("ApiSecret")
            });
            var idSrvOptions = services.BuildServiceProvider().GetService<IdentityServerAuthenticationOptions>();

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
                .AddIdentityServerAuthentication(options =>
                {
                    options.Authority = idSrvOptions.Authority;
                    options.RequireHttpsMetadata = idSrvOptions.RequireHttpsMetadata;
                    options.ApiName = idSrvOptions.ApiName;
                    options.ApiSecret = idSrvOptions.ApiSecret;
            //        options.IntrospectionBackChannelHandler = idSrvOptions.IntrospectionBackChannelHandler;
           //         options.IntrospectionDiscoveryHandler = idSrvOptions.IntrospectionDiscoveryHandler;
                    options.JwtBackChannelHandler = idSrvOptions.JwtBackChannelHandler;
                });

            return services;
        }
    }
}
