using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using MyLfc.Persistence;

namespace MyLfc.Common.Web.Middlewares
{
    public static class OpenIdDictMiddleware
    {
        public static IServiceCollection ApplyCustomOpenIdDict(this IServiceCollection services, IWebHostEnvironment env)
        {
            services.AddOpenIddict()
                .AddCore(options =>
                {
                    // Configure OpenIddict to use the default entities.
                    // Register the Entity Framework stores.
                    options.UseEntityFrameworkCore(opts =>
                    {
                        opts.ReplaceDefaultEntities<int>();
                        opts.UseDbContext<LiverpoolContext>();
                    });
                })
                .AddServer(options =>
                {
                    options.UseMvc();
                    options.EnableLogoutEndpoint("/connect/logout")
                      // Enable the token endpoint (required to use the password flow).
                      .EnableTokenEndpoint("/connect/token")
                      .AllowPasswordFlow()
                      .AllowRefreshTokenFlow()
                      .SetIdentityTokenLifetime(TimeSpan.FromDays(1))
                      //   .SetAccessTokenLifetime(TimeSpan.FromSeconds(10))
                      .SetRefreshTokenLifetime(TimeSpan.FromDays(14))
                      // During development, you can disable the HTTPS requirement.
                      .DisableHttpsRequirement()
                        .AcceptAnonymousClients()//todo fix needed
                      // When request caching is enabled, authorization and logout requests
                      // are stored in the distributed cache by OpenIddict and the user agent
                      // is redirected to the same page with a single parameter (request_id).
                      // This allows flowing large OpenID Connect requests even when using
                      // an external authentication provider like Google, Facebook or Twitter.
                      .EnableRequestCaching();
                    if (env.IsDevelopment())
                    {
                        // Register a new ephemeral key, that is discarded when the application
                        // shuts down. Tokens signed using this key are automatically invalidated.
                        // This method should only be used during development.
                        //      options.AddEphemeralSigningKey();
                    }
                    else
                    {
                        //try
                        //{
                        //    options.AddSigningCertificate(
                        //        new FileStream(Directory.GetCurrentDirectory() + "/cert.pfx", FileMode.Open),
                        //        Configuration.GetSection("Cert")["password"]);
                        //}
                        //catch
                        //{
                        //    options.AddSigningCertificate(
                        //        new FileStream(Directory.GetCurrentDirectory() + "/cert2.pfx", FileMode.Open),
                        //        Configuration.GetSection("Cert")["password"]);
                        //}
                    }
                })
              //.AddValidation(opt =>
              //  {
              //      opt.Configure(options =>
              //      {
              //          if (options.Events != null)
              //          {
              //              options.Events.OnRetrieveToken = context =>
              //              {
              //                  context.Token = context.Request.Query["access_token"];
              //                  return Task.CompletedTask;
              //              };
              //          }
              //      });
              //  })
                ;

            return services;
        }
    }
}
