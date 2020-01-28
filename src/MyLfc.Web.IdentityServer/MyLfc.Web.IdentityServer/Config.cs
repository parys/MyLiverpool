using System.Collections.Generic;
using IdentityServer4.Models;

namespace MyLfc.Web.IdentityServer
{
    /// <summary>
    /// Configuration in memory collections for Identity server.
    /// </summary>
    public class Config
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };
        }
        public static IEnumerable<ApiResource> GetApis(string apiName, string apiSecret)
        {
            return new List<ApiResource>
            {
                new ApiResource(apiName ?? "mylfc", "My LFC API V1")
                {
                    ApiSecrets = new List<Secret>
                    {
                        new Secret(apiSecret ?? "superSecret")
                    }
                }
            };
        }

        public static IEnumerable<Client> GetClients(string apiUrl, string uiUrl)
        {
            return new List<Client>
            {
                new Client
                {
                    AllowAccessTokensViaBrowser = true,
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowedScopes = new[] {"mylfc"},
                    ClientId = "swaggerui",
                    ClientName = "Swagger UI",
                    RedirectUris = new[]
                    {
                        apiUrl + "oauth2-redirect.html"
                    },
                    PostLogoutRedirectUris = new[]
                    {
                        apiUrl + "swagger/"
                    },
                    RequireConsent = false
                },
                new Client {
                    ClientId = "angular.client",
                    ClientName = "My LFC Web",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowedScopes = { "openid", "profile", "mylfc", "offline_access" },
                    RedirectUris =
                    {
                        uiUrl + "auth-callback",
                        uiUrl + "silent-refresh.html"
                    },
                    PostLogoutRedirectUris =
                    {
                        uiUrl,
                    },
                    AllowedCorsOrigins =
                    {
                        "http://localhost:4200",
                        "http://localhost:1669"
                    },
                    AllowAccessTokensViaBrowser = true,
                    AccessTokenLifetime = 3600,
                    AllowOfflineAccess = true,
                    RequireConsent = false,
                    RequireClientSecret = false
                }
            };
        }
    }
}