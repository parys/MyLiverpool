﻿using AspNet.Security.OAuth.Validation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

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

        /// <summary>
        /// Returns existing or new mediator entity.
        /// </summary>
        protected IMediator Mediator => _mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>());
    }
}