using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Application.MatchPersons;
using MyLfc.Common.Web.Hubs;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Manages match events.
    /// </summary>
    public class MatchPersonsController : BaseController
    {
        /// <summary>
        /// Creates or Updates match person.
        /// </summary>
        /// <param name="request">Updated match event dto.</param>
        /// <returns>Updated entity.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("")]
        public async Task<IActionResult> UpdateAsync([FromBody]UpdateMatchPersonCommand.Request request)
        {
            var result = await Mediator.Send(request);
            SignalRHub.Send(HubEndpointConstants.AddMatchPerson, result);
            return Ok(result);
        }

        /// <summary>
        /// Returns all types of match persons.
        /// </summary>
        /// <returns>List of types.</returns>
        [Authorize, HttpGet("getTypes")]
        [ResponseCache(Duration = 24*60)]
        public async Task<IActionResult> GetTypes()
        {
            var list = new List<object>();
            foreach (MatchPersonType type in Enum.GetValues(typeof(MatchPersonType)))
            {
                list.Add(new { key = type, value = type.GetNameAttribute() });
            }
            return Ok(await Task.FromResult(list));
        }

        /// <summary>
        /// Delete match person.
        /// </summary>
        /// <returns>Result of deleting.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpDelete("{matchId:int}/{personId:int}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] DeleteMatchPersonCommand.Request request)
        {
            return Ok(await Mediator.Send(request));
        }
    }
}
