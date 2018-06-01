using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;

namespace MyLiverpool.Web.WebApiNext.Middlewares
{
    public static class SignalRExtensions
    { 
        private static readonly String AUTH_QUERY_STRING_KEY = "token";

        public static void UseSignalRAuthentication(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                if (string.IsNullOrWhiteSpace(context.Request.Headers["Authorization"]))
                {
                    try
                    {
                        if (context.Request.QueryString.HasValue)
                        {

                            var token = context.Request.QueryString.Value
                                .Split('&')
                                .SingleOrDefault(x => x.Contains(AUTH_QUERY_STRING_KEY))?
                                .Split('=')
                                .Last();

                            if (!string.IsNullOrWhiteSpace(token))
                            {
                                context.Request.Headers.Add("Authorization", new[] { $"Bearer {token}" });
                            }

                        }

                    }
                    catch
                    {
                        // if multiple headers it may throw an error.  Ignore both.
                    }
                }
                await next.Invoke();
            });

        }
    }
}
