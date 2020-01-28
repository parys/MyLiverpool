using IdentityServer4.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MyLfc.Domain;
using MyLfc.Persistence;
using MyLfc.Web.IdentityServer.Services;
using Serilog;

namespace MyLfc.Web.IdentityServer
{
    public class Startup
    {
        private IConfiguration Configuration { get; }

        private IWebHostEnvironment Env { get; }

        public Startup(IWebHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
            Env = env;
         //   Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(Configuration)
            //    .CreateLogger();
        }
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<LiverpoolContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<LiverpoolContext>()
                .AddDefaultTokenProviders();

            services.AddIdentityServer()
                .AddDeveloperSigningCredential()
                // this adds the operational data from DB (codes, tokens, consents)
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = builder => builder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                    // this enables automatic token cleanup. this is optional.
                    options.EnableTokenCleanup = true;
                    options.TokenCleanupInterval = 30; // interval in seconds
                })
                //.AddInMemoryPersistedGrants()
                .AddInMemoryIdentityResources(Config.GetIdentityResources())
                .AddInMemoryApiResources(Config.GetApis(Configuration.GetValue<string>("ApiName"),
                    Configuration.GetValue<string>("ApiSecret")))
                .AddInMemoryClients(Config.GetClients(Configuration.GetValue<string>("ApiUrl"),
                    Configuration.GetValue<string>("UiUrl")))
              //  .AddInMemoryIdentityResources(Config.GetIdentityResources())
               // .AddInMemoryApiResources(Config.GetApiResources())
               // .AddInMemoryClients(Config.GetClients())
                .AddAspNetIdentity<User>();

            /* We'll play with this down the road... 
                services.AddAuthentication()
                .AddGoogle("Google", options =>
                {
                    options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;

                    options.ClientId = "<insert here>";
                    options.ClientSecret = "<insert here>";
                });*/

            services.AddTransient<IProfileService, IdentityClaimsProfileService>();

            services.AddCors(options => options.AddPolicy("AllowAll", 
                p => p
                .WithOrigins("localhost:1669", "localhost:4200", "test.mylfc.ru", "mylfc.ru")
                .SetIsOriginAllowed(_ => true)
                .AllowAnyMethod()
                .AllowAnyHeader()));

            services.AddMvc(options =>
            {
                options.EnableEndpointRouting = false;
            }).SetCompatibilityVersion(CompatibilityVersion.Latest);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddSerilog();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseExceptionHandler(builder =>
            //{
            //    builder.Run(async context =>
            //    {
            //        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            //        context.Response.Headers.Add("Access-Control-Allow-Origin", "*");

            //        var error = context.Features.Get<IExceptionHandlerFeature>();
            //        if (error != null)
            //        {
            //            context.Response.AddApplicationError(error.Error.Message);
            //            await context.Response.WriteAsync(error.Error.Message).ConfigureAwait(false);
            //        }
            //    });
            //});

            //var serilog = new LoggerConfiguration()
            //    .MinimumLevel.Verbose()
            //    .Enrich.FromLogContext()
            //    .WriteTo.File(@"authserver_log.txt");

            //loggerFactory.WithFilter(new FilterLoggerSettings
            //{
            //    { "IdentityServer4", LogLevel.Debug },
            //    { "Microsoft", LogLevel.Warning },
            //    { "System", LogLevel.Warning },
            //}).AddSerilog(serilog.CreateLogger());

            app.UseCors("AllowAll");

            app.UseStaticFiles();
            app.UseIdentityServer();

            app.UseMvcWithDefaultRoute();
        }
    }
}
