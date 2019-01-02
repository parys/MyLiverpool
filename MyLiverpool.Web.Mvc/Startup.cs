using System.Collections.Generic;
using System.Globalization;
using System.IO.Compression;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using MyLfc.Common.Web;
using MyLfc.Common.Web.Hubs;
using MyLiverpool.Business.Services.Helpers;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.ResourceAccess;
using MyLiverpool.Data.ResourceAccess.Helpers;
using Newtonsoft.Json.Serialization;
using MyLfc.Common.Web.Middlewares;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using IdentityModel;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;


namespace MyLiverpool.Web.Mvc
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
            Env = env;
        }

        private IConfigurationRoot Configuration { get; }

        private IHostingEnvironment Env { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Optimal);
            services.AddCustomResponseCompression();
            
            services.Configure<RequestLocalizationOptions>(options =>
            {
                options.DefaultRequestCulture = new RequestCulture("ru-RU");
                options.SupportedCultures = new List<CultureInfo> { new CultureInfo("ru-RU") };
                options.RequestCultureProviders = new List<IRequestCultureProvider>();
            });
            services.AddRouting(options => options.LowercaseUrls = true);
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            services.AddCustomDbContext(Configuration);

            //    services.AddDataProtection().SetApplicationName("liverpoolfc-app")
            //       .PersistKeysToFileSystem(new DirectoryInfo(Directory.GetCurrentDirectory()));

            //   services.AddTransient<CookieEventHandler>();
            //   services.AddSingleton<LogoutSessionManager>();

            services.AddCustomIdentitySettings();

            services.AddAuthentication(options =>
                {
                    options.DefaultScheme = "Cookies";//CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = "oidc";

                    options.SchemeMap.Clear();
                    options.DefaultSignInScheme = null;
                    options.DefaultAuthenticateScheme = null;
                })
                //.AddCookie(options =>
                //{
                //    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
                //    options.Cookie.Name = "mvchybrid";
                //})
                .AddCookie("Cookies")
                .AddOpenIdConnect("oidc", options =>
                {
                    options.SignInScheme = "Cookies";
                    options.Authority = Configuration.GetSection("AuthSettings")["Authority"];
                    options.RequireHttpsMetadata = false;

                    options.ClientSecret = Configuration.GetSection("AuthSettings")["ClientSecret"];
                    options.ClientId = Configuration.GetSection("AuthSettings")["ClientId"];

                    options.ResponseType = "code id_token";

                  //  options.Scope.Add("openid");
                  //  options.Scope.Add("profile");
                    options.Scope.Add("role");
                    options.Scope.Add("apiV1");
                    options.Scope.Add("offline_access");
                    
                    options.GetClaimsFromUserInfoEndpoint = true;
                    options.SaveTokens = true;
                  //  options.ClaimActions.MapJsonKey("role", "role");

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = JwtClaimTypes.Name,
                        RoleClaimType = JwtClaimTypes.Role,
                    };
                    options.Events = new OpenIdConnectEvents
                    {
                        OnUserInformationReceived = usr =>
                        {
                            return Task.FromResult(usr);
                        }
                    };
                });

            RegisterCoreHelpers(services);
            services.RegisterRepositories();
            services.RegisterServices();

            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));

            services.AddCustomRedisCache(Configuration);

            var context = (LiverpoolContext)services.BuildServiceProvider().GetService(typeof(LiverpoolContext));
            context.Database.Migrate();

            services.Configure<AuthenticationOptions>(options =>
            {
                var vv = options;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            //app.UseForwardedHeaders(new ForwardedHeadersOptions
            //{
            //    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            //});

          //  app.UseCustomResponseCompression();

            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseAuthentication();
            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=86400");
                }
            });


            app.UseMvcWithDefaultRoute();
        }

        private void RegisterCoreHelpers(IServiceCollection services)
        {
            services.AddSingleton<IHostingEnvironment>(Env);
            services.AddSingleton<IConfigurationRoot>(Configuration);
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<ISignalRHubAggregator, EmptyHubAggregator>();
        }
    }
}
