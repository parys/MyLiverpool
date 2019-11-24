using AspNet.Security.OAuth.Validation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using MyLfc.Common.Web.DistributedCache;
using MyLfc.Common.Web.Hubs;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <response code="400">Bad input parameter, i.e. entityID has not valid GUID format</response>            
    /// <response code="401">Missing or invalid authentication, user not authenticated</response>            
    /// <response code="403">User not authorized to perform the operation, access token does not have the required scope</response>      
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    [Produces("application/json")]
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme)]
    public class BaseController : ControllerBase
    {
        private IMediator _mediator;
        private IDistributedCacheManager _cacheManager;
        private ISignalRHubAggregator _signalR;

        /// <summary>
        /// Returns existing or new mediator entity.
        /// </summary>
        protected IMediator Mediator => _mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>());
        
        /// <summary>
        /// Returns existing or new cache manager.
        /// </summary>
        protected IDistributedCacheManager CacheManager => _cacheManager ?? (_cacheManager = HttpContext.RequestServices.GetService<IDistributedCacheManager>());
    
        /// <summary>
        /// Returns existing or new cache manager.
        /// </summary>
        protected ISignalRHubAggregator SignalRHub => _signalR ?? (_signalR = HttpContext.RequestServices.GetService<ISignalRHubAggregator>());
    }
}
