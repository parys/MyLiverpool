using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;

namespace MyLfc.Common.Web.Compression
{
    public static class ResponseCompression
    {
        public static IApplicationBuilder UseQualityResponseCompression(this IApplicationBuilder app)
        {
            app.UseMiddleware<ResponseCompressionQualityMiddleware>(new Dictionary<string, double>
                {
                    {"br", 1.0},
                    {"gzip", 0.9}
                })
                .UseResponseCompression();
            return app;
        }
    }
}
