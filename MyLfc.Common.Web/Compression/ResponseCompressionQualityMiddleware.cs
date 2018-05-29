using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;

namespace MyLfc.Common.Web.Compression
{

    public class ResponseCompressionQualityMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IDictionary<string, double> _encodingQuality;
        public ResponseCompressionQualityMiddleware(RequestDelegate next, IDictionary<string, double> encodingQuality)
        {
            _next = next;
            _encodingQuality = encodingQuality;
        }
        public async Task Invoke(HttpContext context)
        {
            StringValues encodings = context.Request.Headers[HeaderNames.AcceptEncoding];
            if (!StringValues.IsNullOrEmpty(encodings)
                && StringWithQualityHeaderValue.TryParseList(encodings, out var encodingsList)
                && (encodingsList != null) && (encodingsList.Count > 0))
            {
                string[] encodingsWithQuality = new string[encodingsList.Count];
                for (int encodingIndex = 0; encodingIndex < encodingsList.Count; encodingIndex++)
                {
                    // If there is any quality value provided don't change anything
                    if (encodingsList[encodingIndex].Quality.HasValue)
                    {
                        encodingsWithQuality = null;
                        break;
                    }
                    else
                    {
                        var encodingValue = encodingsList[encodingIndex].Value.Value;
                        encodingsWithQuality[encodingIndex] = (new StringWithQualityHeaderValue(encodingValue,
                            _encodingQuality.ContainsKey(encodingValue) ? _encodingQuality[encodingValue] : 0.1)).ToString();
                    }
                }
                if (encodingsWithQuality != null)
                    context.Request.Headers[HeaderNames.AcceptEncoding] = new StringValues(encodingsWithQuality);
            }
            await _next(context);
        }
    }
}
