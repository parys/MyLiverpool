using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Common.Web;
using MyLfc.Common.Web.DistributedCache;
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
    public class MatchEventsController : Controller
    {
        private readonly IMatchEventService _matchEventService;
        private readonly IDistributedCacheManager _cacheManager;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="matchEventService"></param>
        /// <param name="cacheManager"></param>
        public MatchEventsController(IMatchEventService matchEventService,  IDistributedCacheManager cacheManager)
        {
            _matchEventService = matchEventService;
            _cacheManager = cacheManager;
        }

        /// <summary>
        /// Creates new match event.
        /// </summary>
        /// <param name="dto">Filled match event model.</param>
        /// <returns>Created entity.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody]MatchEventDto dto)
        {
            if (dto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _matchEventService.CreateAsync(dto);

            _cacheManager.Remove(CacheKeysConstants.MatchCalendarCacheConst);
            return Ok(result);
        }

        /// <summary>
        /// Updates match event.
        /// </summary>
        /// <param name="id">The identifier of entity.</param>
        /// <param name="dto">Updated match event dto.</param>
        /// <returns>Updated entity.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody]MatchEventDto dto)
        {
            if (!ModelState.IsValid || id != dto.Id)
            {
                return BadRequest();
            }
            var result = await _matchEventService.UpdateAsync(dto);

            _cacheManager.Remove(CacheKeysConstants.MatchCalendarCacheConst);
            return Ok(result);
        }

        /// <summary>
        /// Returns match event by id.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>Found match event entity.</returns>
        [Authorize, HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int id = 1)
        {
            var result = await _matchEventService.GetByIdAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// Returns match events by match id.
        /// </summary>
        /// <param name="id">The identifier of match.</param>
        /// <returns>List of match events for match.</returns>
        [Authorize, HttpGet("getForMatch/{id:int}")]
        public async Task<IActionResult> GetForMatchAsync(int id)
        {
            if (id < 1)
            {
                return BadRequest();
            }
            var result = await _matchEventService.GetListByMatchIdAsync(id);
            return Json(result);
        }

        /// <summary>
        /// Returns all types of match events.
        /// </summary>
        /// <returns>List of types.</returns>
        [Authorize, HttpGet("getTypes")]
        public IActionResult GetTypes()
        {
            var list = new List<object>();
            foreach (MatchEventType type in Enum.GetValues(typeof(MatchEventType)))
            {
                list.Add(new { id = type, name = type.GetNameAttribute() });
            }
            return Ok(list);
        }

        /// <summary>
        /// Delete match.
        /// </summary>
        /// <returns>Result of deletion.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _matchEventService.DeleteAsync(id);

            _cacheManager.Remove(CacheKeysConstants.MatchCalendarCacheConst);
            return Ok(result);
        }
    }
}
