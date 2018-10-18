using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4;
using IdentityServer4.Models;

namespace MyLFC.Web.IdentityServer
{
    public class Config
    {
        private const string ApiV1 = "apiV1";
        // scopes define the resources in your system
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResource("role", "role", new[] {"role"})
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource(ApiV1, "My LFC API V1")
            };
        }

        // clients want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients()
        {
            // client credentials client
            return new List<Client>
            {
                new Client
                {
                    ClientId = "client",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },
                    AllowedScopes = { ApiV1 }
                },

                // resource owner password grant client
                new Client
                {
                    ClientId = "ro.client",
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },
                    AllowedScopes = { ApiV1 }
                },

                // OpenID Connect hybrid flow and client credentials client (MVC)
                new Client
                {
                    ClientId = "mvc",
                    ClientName = "MyLFC Lite",
                    AllowedGrantTypes = GrantTypes.HybridAndClientCredentials,
                    AlwaysIncludeUserClaimsInIdToken = true,
                    RequireConsent = false,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    RedirectUris = { "http://localhost:1668/signin-oidc",
                                     "http://localhost:5003/signin-oidc", },
                    PostLogoutRedirectUris = {
                        "http://localhost:1668/signout-callback-oidc",
                        "http://localhost:5003/signout-callback-oidc"

                    },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        IdentityServerConstants.StandardScopes.OfflineAccess,
                        "role",
                        ApiV1
                    },
                    AllowOfflineAccess = true
                },
                // OpenID Connect implicit flow client (Angular)
                new Client
                {
                    ClientId = "ng",
                    ClientName = "Angular Client",
                    AccessTokenLifetime = 60*60,// 60 minutes
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    AlwaysSendClientClaims=true,
                    AlwaysIncludeUserClaimsInIdToken = true,
                    RequireConsent = false,
                    AllowOfflineAccess = true,
                    AccessTokenType = AccessTokenType.Jwt,

                    RedirectUris = { "http://localhost:1669/" },
                    PostLogoutRedirectUris = { "http://localhost:1669/" },
                    AllowedCorsOrigins = { "http://localhost:1669" },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "role",
                        ApiV1
                    },
                }
            };
        }
    }
}
