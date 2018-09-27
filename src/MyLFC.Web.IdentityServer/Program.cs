using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace MyLFC.Web.IdentityServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
           // CreateWebHostBuilder(args).Build().Run();


            var host = CreateWebHostBuilder(args).Build();

            Startup.EnsureSeedData(host.Services);
            

            host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
