using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Manages match events.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class MatchPersonsController : Controller
    {
        private readonly IMatchPersonService _matchPersonService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="matchPersonService"></param>
        public MatchPersonsController(IMatchPersonService matchPersonService)
        {
            _matchPersonService = matchPersonService;
        }

        /// <summary>
        /// Creates new match person.
        /// </summary>
        /// <param name="dto">Filled match person model.</param>
        /// <returns>Created entity.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody]MatchPersonDto dto)
        {
            if (dto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _matchPersonService.CreateAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Updates match person.
        /// </summary>
        /// <param name="dto">Updated match event dto.</param>
        /// <returns>Updated entity.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("")]
        public async Task<IActionResult> UpdateAsync([FromBody]MatchPersonDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _matchPersonService.UpdateAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Returns match person by id.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>Found match person entity.</returns>
        [Authorize, HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            if (id < 1)
            {
                id = 1;
            }
            var result = await _matchPersonService.GetByIdAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// Returns match persons by match id.
        /// </summary>
        /// <param name="id">The identifier of match.</param>
        /// <returns>List of match events for match.</returns>
        [AllowAnonymous, HttpGet("getForMatch/{id:int}")]
        public async Task<IActionResult> GetForMatchAsync(int id)
        {
            if (id < 1)
            {
                return BadRequest();
            }
            var result = await _matchPersonService.GetListByMatchIdAsync(id);
            return Json(result);
        }

        /// <summary>
        /// Returns all types of match persons.
        /// </summary>
        /// <returns>List of types.</returns>
        [Authorize, HttpGet("getTypes")]
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
        public async Task<IActionResult> DeleteAsync(int matchId, int personId)
        {
            var result = await _matchPersonService.DeleteAsync(matchId, personId);
            return Ok(result);
        }
    }
}
