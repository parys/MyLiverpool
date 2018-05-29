using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.DependencyInjection;

namespace MyLfc.Common.Web.Compression
{
    public static class ResponseCompressionMiddleware
    {
        public static void ConfigureCustomResponseCompression(this IServiceCollection services)
        {
            services.AddResponseCompression(options => {
                options.Providers.Add<BrotliCompressionProvider>();
                options.Providers.Add<GzipCompressionProvider>();
                options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "image/svg+xml" });
             //   options.EnableForHttps = true;
            });

        }
    }
}
