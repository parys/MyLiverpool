using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using AspNet.Security.OpenIdConnect.Primitives;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using MyLiverpool.Business.Services.Helpers;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess;
using MyLiverpool.Data.ResourceAccess.Helpers;
using MyLiverpool.Web.WebApiNext.Extensions;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using MyLfc.Common.Web.Compression;

namespace MyLiverpool.Web.WebApiNext
{
    /// <summary>
    /// Startup class.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="env"></param>
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                // builder.AddUserSecrets<Startup>();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
            Env = env;
        }

        private IConfigurationRoot Configuration { get; }

        private IHostingEnvironment Env { get; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services">IServiceCollection.</param>
        public void ConfigureServices(IServiceCollection services)
        {
          //  services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Optimal);
            services.ConfigureCustomResponseCompression();

            services.Configure<RequestLocalizationOptions>(options =>
            {
                options.DefaultRequestCulture = new RequestCulture("ru-RU");
                options.SupportedCultures = new List<CultureInfo> { new CultureInfo("ru-RU") };
                options.RequestCultureProviders = new List<IRequestCultureProvider>();
            });
            services.AddRouting(options => options.LowercaseUrls = true);
            services.AddMvc(options =>
            {
            }).AddJsonOptions(options =>
           {
               options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
           });

            services.AddDbContext<LiverpoolContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                options.UseOpenIddict<int>();
            });

            services.AddDataProtection().SetApplicationName("liverpoolfc-app")
                .PersistKeysToFileSystem(new DirectoryInfo(Directory.GetCurrentDirectory()));

            services.AddIdentity<User, Role>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.User.RequireUniqueEmail = true;
                options.User.AllowedUserNameCharacters =
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@!#$&?абвгдеёжзийклмнопрстуфхцчшщъыьэюяAБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
                options.SignIn.RequireConfirmedEmail = true;
                options.SignIn.RequireConfirmedPhoneNumber = false;
                options.Lockout.AllowedForNewUsers = true;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromSeconds(10);
            })
                .AddEntityFrameworkStores<LiverpoolContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            services.AddAuthentication()
            //        options =>
            //{
            //    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //})
            .AddOAuthValidation();

            services.AddOpenIddict<int>(options =>
              {
                  options.AddEntityFrameworkCoreStores<LiverpoolContext>()
                      .AddMvcBinders()
                      .EnableLogoutEndpoint("/connect/logout")
                      // Enable the token endpoint (required to use the password flow).
                      .EnableTokenEndpoint("/connect/token")
                      .AllowPasswordFlow()
                      .AllowRefreshTokenFlow()
                      //    .SetIdentityTokenLifetime(TimeSpan.FromDays(14))
                      //   .SetAccessTokenLifetime(TimeSpan.FromSeconds(10))
                      .SetRefreshTokenLifetime(TimeSpan.FromDays(14))
                      // During development, you can disable the HTTPS requirement.
                      .DisableHttpsRequirement()
                      // When request caching is enabled, authorization and logout requests
                      // are stored in the distributed cache by OpenIddict and the user agent
                      // is redirected to the same page with a single parameter (request_id).
                      // This allows flowing large OpenID Connect requests even when using
                      // an external authentication provider like Google, Facebook or Twitter.
                      .EnableRequestCaching();
                  if (Env.IsDevelopment())
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
              });

          //    services.AddSignalR();

            RegisterCoreHelpers(services);
            services.RegisterRepositories();
            services.RegisterServices();

            services.AddCors(options =>
            {
                options.AddPolicy("MyPolicy", builder =>
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader().Build();
                });
            });
            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));


            services.AddMemoryCache();

            //   services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

            if (Env.IsDevelopment())
            {
                services.AddSwaggerGen(options =>
                {
                    options.SwaggerDoc("v1", new Info
                    {
                        Version = "v1",
                        Title = "Swagger Sample API",
                        Description = "API Sample made",
                        TermsOfService = "None"
                    });

                    //    var filePath = Path.Combine(PlatformServices.Default.Application.ApplicationBasePath, "MyApi.xml");
                    //s    options.IncludeXmlComments(filePath);
                    options.OperationFilter<HandleModelbinding>();

                    options.AddSecurityDefinition("oauth2", new OAuth2Scheme()
                    {
                        Type = "oauth2",
                        Flow = "implicit",
                        AuthorizationUrl = "/connect/authorize",
                        //   Extensions = { {"123", new object()}},
                        TokenUrl = "connect/token",
                        Scopes = new Dictionary<string, string>
                        {
                            {"roles", "roles scope"},
                            {"openid", "openid scope"}
                        },
                    });

                    //   options.OperationFilter<AssignSecurityRequirements>();
                });
            }

            services.AddNodeServices(options =>
            {
              //  options.DebuggingPort = 8888;
             //   options.LaunchWithDebugging = true;

             //   options.InvocationTimeoutMilliseconds = 140000;
            });
            var context = (LiverpoolContext) services.BuildServiceProvider().GetService(typeof(LiverpoolContext));
            context.Database.Migrate();
            //if (Env.IsDevelopment())
            //{
            //    new DatabaseInitializer(context).Seed();
            //}

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist/aspnetcorespa";
            });
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        /// <param name="loggerFactory"></param>
        /// <param name="antiforgery"></param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IAntiforgery antiforgery)
        {
          //  app.UseMiddleware<ExceptionHandlerMiddleware>();
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });


            // app.UseXsrf();
            if (env.IsDevelopment())
            {
                loggerFactory.AddConsole(Configuration.GetSection("Logging"));
                loggerFactory.AddDebug();
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();

                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "V1 Docs");
                 //   c.ConfigureOAuth2("test-client-id123", "test-client-secr43et", "test-rea32lm", "test-a11pp");
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseCors("MyPolicy");

            app.UseQualityResponseCompression();
            app.UseAuthentication();

            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=86400");
                },
             //   ServeUnknownFileTypes = true
            });
            app.UseSpaStaticFiles(new StaticFileOptions()
                {
               //     ServeUnknownFileTypes = true
                }
            );

            //app.UseSignalR(routes =>
            //{
            //    routes.MapHub<LfcHub>("hub");
            //});

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");

                //routes.MapSpaFallbackRoute(
                //    name: "spa-fallback",
                //    defaults: new { controller = "Spa", action = "Index" });
            });
            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                /*
                         // If you want to enable server-side rendering (SSR),
                         // [1] In AspNetCoreSpa.csproj, change the <BuildServerSideRenderer> property
                         //     value to 'true', so that the SSR bundle is built during publish
                         // [2] Uncomment this code block
                         */

                //   spa.UseSpaPrerendering(options =>
                //    {
                //        options.BootModulePath = $"{spa.Options.SourcePath}/dist-server/main.bundle.js";
                //        options.BootModuleBuilder = env.IsDevelopment() ? new AngularCliBuilder(npmScript: "build:ssr") : null;
                //        options.ExcludeUrls = new[] { "/sockjs-node" };
                //        options.SupplyData = (requestContext, obj) =>
                //        {
                //          //  var result = appService.GetApplicationData(requestContext).GetAwaiter().GetResult();
                //          obj.Add("Cookies", requestContext.Request.Cookies);
                //        };
                //    });

                if (env.IsDevelopment())
                {
                       spa.UseAngularCliServer(npmScript: "start");
                    //   OR
                   // spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });


        }

        private void RegisterCoreHelpers(IServiceCollection services)
        {
            services.AddSingleton<IHostingEnvironment>(Env);
            services.AddSingleton<IConfigurationRoot>(Configuration);
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }
    }
}