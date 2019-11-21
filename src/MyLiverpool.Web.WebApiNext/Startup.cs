using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MyLiverpool.Business.Services.Helpers;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.ResourceAccess.Helpers;
using MyLiverpool.Web.WebApiNext.Extensions;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using MyLfc.Application.Infrastructure;
using MyLfc.Application.Infrastructure.Profiles;
using MyLfc.Common.Web;
using MyLfc.Common.Web.Hubs;
using MyLfc.Common.Web.Middlewares;
using MyLfc.Persistence;
using MyLiverpool.Common.Mappings;
using MyLiverpool.Web.WebApiNext.Infrastructure.Filters;

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
            services.Configure<SsrSettings>(Configuration.GetSection("Settings"));

            if (Configuration.GetSection("Settings") != null &&
                Convert.ToBoolean(Configuration.GetSection("Settings")["Compression"]))
            {
                services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Optimal);
                services.AddCustomResponseCompression();
            }

            services.Configure<RequestLocalizationOptions>(options =>
            {
                options.DefaultRequestCulture = new RequestCulture("ru-RU");
                options.SupportedCultures = new List<CultureInfo> {new CultureInfo("ru-RU")};
                options.RequestCultureProviders = new List<IRequestCultureProvider>();
            });
            services.AddRouting(options => options.LowercaseUrls = true);
            services.AddMvc(options => { options.Filters.Add(typeof(RequestDecorator)); })
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddCors(options =>
            {
                options.AddPolicy("MyPolicy", builder =>
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader().Build();
                });
            });

            services.AddCustomDbContext(Configuration);

            services.AddDataProtection().SetApplicationName("liverpoolfc-app")
                .PersistKeysToFileSystem(new DirectoryInfo(Directory.GetCurrentDirectory()));

            services.AddCustomIdentitySettings();

            services.AddAuthentication()
                .AddOAuthValidation(options =>
                {
                    options.Events.OnRetrieveToken = context =>
                    {
                        context.Token = context.Request.Query["access_token"];
                        return Task.CompletedTask;
                    };
                });
            services.ApplyCustomOpenIdDict(Env);

            services.AddSignalR()
              // todo .AddMessagePackProtocol(options =>
             //       options.FormatterResolvers = new List<IFormatterResolver>
             //           {MessagePack.Resolvers.ContractlessStandardResolver.Instance})
                        ;

        RegisterCoreHelpers(services);
            services.RegisterRepositories();
            services.RegisterServices();

            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));
            services.Configure<SsrSettings>(Configuration.GetSection("SSR"));
            services.AddCustomRedisCache(Configuration);

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

                    options.AddSecurityDefinition("oauth2", new OAuth2Scheme
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
            services.AddAutoMapper(typeof(MaterialProfile), typeof(ForumMessageMapperProfile));
            services.AddMediatR();
            //services.AddNodeServices(options =>
            //{
            //      options.DebuggingPort = 9229;
            //      options.LaunchWithDebugging = false;

            //      //   options.InvocationTimeoutMilliseconds = 140000;
            //});
            var dbContext = (LiverpoolContext)services.BuildServiceProvider().GetService(typeof(LiverpoolContext));
            dbContext.Database.Migrate();
            //if (Env.IsDevelopment())
            //{
            //    new DatabaseInitializer(context).Seed();
            //}

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist/aspnetcorespa"; });
            
            services.AddScoped<RequestContext>();
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

            // app.UseXsrf();
            if (env.IsDevelopment())
            {
               // loggerFactory.AddConsole(Configuration.GetSection("Logging"));
 //               loggerFactory.AddDebug();
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
                app.UseForwardedHeaders(new ForwardedHeadersOptions
                {
                    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
                });
                if (Configuration.GetSection("Settings") != null &&
                    Convert.ToBoolean(Configuration.GetSection("Settings")["Compression"]))
                {
                    app.UseCustomResponseCompression();
                }
            }

            app.UseCors("MyPolicy");
            //   app.UseSignalRAuthentication();

            app.UseDefaultFiles();

            var cachePeriod = env.IsDevelopment() ? "600" : "6048000";
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Cache-Control", $"public, max-age={cachePeriod}");
                }
            });
            if (!Env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseAuthentication();

            app.UseSignalR(routes =>
            {
                routes.MapHub<AnonymHub>("/hubs/anonym");
                routes.MapHub<AuthHub>("/hubs/auth");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            //    if (!Env.IsDevelopment())
            {
                var ssrEnabled = Configuration.GetSection("SSR") != null && Convert.ToBoolean(Configuration.GetSection("SSR")["Enabled"]);
                app.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "ClientApp";

                    /*
                             // If you want to enable server-side rendering (SSR),
                             // [1] In AspNetCoreSpa.csproj, change the <BuildServerSideRenderer> property
                             //     value to 'true', so that the SSR bundle is built during publish
                             // [2] Uncomment this code block
                             */

                    if (ssrEnabled)
                    {
                        spa.UseSpaPrerendering(options =>
                        {
                            options.BootModulePath = $"{spa.Options.SourcePath}/dist-server/main.js";
                            options.BootModuleBuilder =
                                env.IsDevelopment() ? new AngularCliBuilder(npmScript: "build:ssr") : null;
                            options.ExcludeUrls = new[] { "/sockjs-node", "/src", "/content", "/hubs", "/null", "/0", "/lite" };
                            options.SupplyData = (requestContext, obj) =>
                            {
                                //  var result = appService.GetApplicationData(requestContext).GetAwaiter().GetResult();
                       //         obj.Add("Cookies", requestContext.Request.Cookies);
                            };
                        });
                    }

                    if (env.IsDevelopment())
                    {
                       // spa.UseAngularCliServer(npmScript: "start");
                        //   OR
                       //  spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                    }
                });
            }
        }

        private void RegisterCoreHelpers(IServiceCollection services)
        {
            services.AddSingleton<IHostingEnvironment>(Env);
            services.AddSingleton<IConfigurationRoot>(Configuration);
            services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<ISignalRHubAggregator, SignalRHubAggregator>();
        }
    }
}