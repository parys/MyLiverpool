using System.Collections.Generic;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Server;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Data.Entities;
using System.Linq;
using AspNet.Security.OpenIdConnect.Primitives;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MyLiverpool.Business.Contracts;
using OpenIddict.Core;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    using OpenIddict.Abstractions;
    using OpenIddict.EntityFrameworkCore.Models;

    /// <inheritdoc />
    /// <summary>
    /// Controller for authorization actions.
    /// </summary>
    [AllowAnonymous]
    public class AuthorizationController : Controller
    {
        private readonly OpenIddictApplicationManager<OpenIddictApplication<int>> _applicationManager;
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IUserService _userService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="applicationManager"></param>
        /// <param name="signInManager"></param>
        /// <param name="userManager"></param>
        /// <param name="userService"></param>
        /// <param name="identityOptions"></param>
        public AuthorizationController(
            OpenIddictApplicationManager<OpenIddictApplication<int>> applicationManager,
            SignInManager<User> signInManager,
            UserManager<User> userManager, IUserService userService,
            IOptions<IdentityOptions> identityOptions)
        {
            _applicationManager = applicationManager;
            _signInManager = signInManager;
            _userManager = userManager;
            _userService = userService;
            _identityOptions = identityOptions;
        }

        /// <summary>
        /// Authorizes user by password grant type.
        /// </summary>
        /// <returns>Result of authentification.</returns>
        [HttpPost("~/connect/token")]
        public async Task<IActionResult> Exchange(OpenIdConnectRequest request)
        {
            if (request.IsPasswordGrantType())
            {
                var user = await _userManager.FindByNameAsync(request.Username);
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The username/password couple is invalid."
                    });
                }

                if (!user.EmailConfirmed)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = "unconfirmed_email",
                        ErrorDescription = "User should check his email."
                    });
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
                if (!result.Succeeded)
                {
                    if (result.IsLockedOut)
                    {
                        var lockDate = await _userManager.GetLockoutEndDateAsync(user);
                        return BadRequest(new OpenIdConnectResponse
                        {
                            Error = OpenIdConnectConstants.Errors.AccessDenied,
                            ErrorDescription = "The user is locked out.",
                            ExpiresIn = lockDate.Value.ToUnixTimeMilliseconds()
                        });
                    }
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The username/password couple is invalid."
                    });

                }

                if (_userManager.SupportsUserLockout && !await _userManager.IsLockedOutAsync(user))
                {
                    await _userManager.ResetAccessFailedCountAsync(user);
                }

                var ticket = await CreateTicketAsync(request, user);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else if ( request.IsRefreshTokenGrantType()) //request.IsAuthorizationCodeGrantType() ||
            {
                // Retrieve the claims principal stored in the authorization code/refresh token.
                var info = await HttpContext.AuthenticateAsync(
                    OpenIdConnectServerDefaults.AuthenticationScheme);      
                
                // Retrieve the user profile corresponding to the authorization code/refresh token.
                // Note: if you want to automatically invalidate the authorization code/refresh token
                // when the user password/roles change, use the following line instead:
                // var user = _signInManager.ValidateSecurityStampAsync(info.Principal);
                var user = await _userManager.GetUserAsync(info.Principal);
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The token is no longer valid."
                    });
                }

                // Ensure the user is still allowed to sign in.
                if (!await _signInManager.CanSignInAsync(user))
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The user is no longer allowed to sign in."
                    });
                }
                if (_userManager.SupportsUserLockout && await _userManager.IsLockedOutAsync(user))
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.AccessDenied,
                        ErrorDescription = "The user is locked out."
                    });
                }
                // Create a new authentication ticket, but reuse the properties stored in the
                // authorization code/refresh token, including the scopes originally granted.
                var ticket = await CreateTicketAsync(request, user, info.Properties);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            return BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "The specified grant type is not supported."
            });
        }

        /// <summary>
        /// Authorizes user by implicit flow.
        /// </summary>
        /// <returns></returns>
        [Authorize, HttpGet, Route("~/connect/authorize")]
        public async Task<IActionResult> Authorize()
        {
            var request = HttpContext.GetOpenIdConnectRequest();
            
            var application = await _applicationManager.FindByClientIdAsync(request.ClientId, HttpContext.RequestAborted);
            if (application == null)
            {
                return BadRequest(OpenIdConnectConstants.Errors.InvalidClient);
            }
            
            // Retrieve the profile of the logged in user.
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return BadRequest(OpenIdConnectConstants.Errors.ServerError);
            }

            if (!user.EmailConfirmed)
            {
                return BadRequest("unconfirmed_email");
            }


            var ticket = await CreateTicketAsync(request, user);

            // Returning a SignInResult will ask OpenIddict to issue the appropriate access/identity tokens.
            return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
        }

        /// <summary>
        /// Logouts user.
        /// </summary>
        /// <returns>Result of signOut.</returns>
        [Authorize, HttpGet("~/connect/logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            // Returning a SignOutResult will ask OpenIddict to redirect the user agent
            // to the post_logout_redirect_uri specified by the client application.
            return SignOut(OpenIdConnectServerDefaults.AuthenticationScheme);
        }

        private async Task<AuthenticationTicket> CreateTicketAsync(OpenIdConnectRequest request, User user, AuthenticationProperties properties = null)
        {
            // Create a new ClaimsPrincipal containing the claims that
            // will be used to create an id_token, a token or a code.
            var principal = await _signInManager.CreateUserPrincipalAsync(user);

            var ticket = new AuthenticationTicket(principal, properties,
                OpenIdConnectServerDefaults.AuthenticationScheme);

            if (!request.IsAuthorizationCodeGrantType() && !request.IsRefreshTokenGrantType())
            {
                // Set the list of scopes granted to the client application.
                // Note: the offline_access scope must be granted
                // to allow OpenIddict to return a refresh token.
                ticket.SetScopes(new[]
                {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles
                }.Intersect(request.GetScopes()));
            }

            // Note: by default, claims are NOT automatically included in the access and identity tokens.
            // To allow OpenIddict to serialize them, you must attach them a destination, that specifies
            // whether they should be included in access tokens, in identity tokens or in both.

            foreach (var claim in principal.Claims)
            {
                if (claim.Type == _identityOptions.Value.ClaimsIdentity.SecurityStampClaimType)
                {
                    continue;
                }
                var destinations = new List<string>
                {
                    OpenIdConnectConstants.Destinations.AccessToken
                };

                // Only add the iterated claim to the id_token if the corresponding scope was granted to the client application.
                // The other claims will only be added to the access_token, which is encrypted when using the default format.
                if ((claim.Type == OpenIdConnectConstants.Claims.Name && ticket.HasScope(OpenIdConnectConstants.Scopes.Profile)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Email && ticket.HasScope(OpenIdConnectConstants.Scopes.Email)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Role && ticket.HasScope(OpenIddictConstants.Claims.Roles)))
                {
                    destinations.Add(OpenIdConnectConstants.Destinations.IdentityToken);
                }

                claim.SetDestinations(destinations);
            }

            ticket.Properties.AllowRefresh = true;
         //   var roles = principal.Claims.Where(c => c.Type == ClaimTypes.Role).ToList();
       //     ticket.Properties.Items.Add(new KeyValuePair<string, string>("roles", string.Join(", ", roles.Select(r => r.Value))));
            //  ticket.Properties.ExpiresUtc = DateTimeOffset.Now.AddDays(14);
            //  ticket.Properties.IsPersistent = false;

            await UpdateIpAddressForUser(user.Id);

            return ticket;
        }

        private async Task UpdateIpAddressForUser(int userId)
        {
            var ip = HttpContext.Connection.RemoteIpAddress.ToString();
            await _userService.UpdateUserIpAddress(ip, userId);
        }
    }
}
