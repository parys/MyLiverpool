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
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;
using Newtonsoft.Json;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Manages matches.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class MatchesController : Controller
    {
        private readonly IMatchService _matchService;
        private readonly IHelperService _helperService;
        private readonly IDistributedCacheManager _cacheManager;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="matchService">Injected value.</param>
        /// <param name="helperService"></param>
        /// <param name="cacheManager"></param>
        public MatchesController(IMatchService matchService, IHelperService helperService, IDistributedCacheManager cacheManager)
        {
            _matchService = matchService;
            _helperService = helperService;
            _cacheManager = cacheManager;
        }

        /// <summary>
        /// Creates new match.
        /// </summary>
        /// <param name="dto">Filled match model.</param>
        /// <returns>Created entity.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody]MatchDto dto)
        {
            if (dto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _matchService.CreateAsync(dto);
            _cacheManager.Remove(CacheKeysConstants.MatchCalendarCacheConst);
            return Ok(result);
        }

        /// <summary>
        /// Updates match.
        /// </summary>
        /// <param name="id">The identifier of entity.</param>
        /// <param name="dto">Updated match dto.</param>
        /// <returns>Updated entity.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody]MatchDto dto)
        {
            if (!ModelState.IsValid || id != dto.Id)
            {
                return BadRequest();
            }
            var result = await _matchService.UpdateAsync(dto);
            _cacheManager.Remove(CacheKeysConstants.MatchCalendarCacheConst);
            return Ok(result);
        }      
        
        /// <summary>
        /// Returns match by id.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>Found match entity.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            if (id < 1)
            {
                id = 1;
            }
            var result = await _matchService.GetByIdAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// Returns header match.
        /// </summary>
        /// <returns>Found match entity.</returns>
        [AllowAnonymous, HttpGet("header")]
        public async Task<IActionResult> GetForHeaderAsync()
        {
            var helpEntity = await _cacheManager.GetOrCreateAsync(CacheKeysConstants.HeaderMatchId,
                async () => await _helperService.GetValueAsync(HelperEntityType.HeaderMatch));
            if (!string.IsNullOrWhiteSpace(helpEntity))
            {
                var result = await _matchService.GetByIdAsync(int.Parse(helpEntity));//todo add cache?
                result.Events = new List<MatchEventDto>(); //not need events on UI for header
                return Json(result);
            }
            return Json(null);
        }

        /// <summary>
        /// Set new match id value as header match id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("{id:int}/setAsHeader")]
        public async Task<IActionResult> SetAsHeader(int id)
        {
            await _helperService.CreateOrUpdateAsync(HelperEntityType.HeaderMatch, id > 0 ? id.ToString() : null);
            _cacheManager.Remove(CacheKeysConstants.HeaderMatchId);
            return Json(true);
        }

        /// <summary>
        /// Returns matches for calendar.
        /// </summary>
        /// <returns>Two matches for calendar.</returns>
        [AllowAnonymous, HttpGet("getForCalendar")]
        public async Task<IActionResult> GetForCalendarAsync()
        {
            var result = await _cacheManager.GetOrCreateAsync(CacheKeysConstants.MatchCalendarCacheConst,
                async () => await _matchService.GetForCalendarAsync());
            return Ok(result);
        }

        /// <summary>
        /// Returns match list.
        /// </summary>
        /// <param name="page">The page of match list.</param>
        /// <returns>Selected page match list.</returns>
        [AllowAnonymous, HttpGet]
        [Obsolete("Remove after 11.11")]
        public async Task<IActionResult> GetListAsync([FromQuery]int page = 1)
        {
            if (page < 1)
            {
                page = 1;
            }
            var result = await _matchService.GetListAsync(page);
            return Ok(result);
        }

        /// <summary>
        /// Returns matches list by filter.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [AllowAnonymous, HttpGet("{dto}")]
        public async Task<IActionResult> List([FromRoute] string dto)
        {
            if (string.IsNullOrWhiteSpace(dto))
            {
                return BadRequest();
            }
            var obj = JsonConvert.DeserializeObject<MatchFiltersDto>(dto, new JsonSerializerSettings() //todo should be application wide settings
            {
                MissingMemberHandling = MissingMemberHandling.Ignore,
                NullValueHandling = NullValueHandling.Include,
                DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate
            });

            var model = await _matchService.GetListAsync(obj);
            return Json(model);
        }



        /// <summary>
        /// Returns all types of matches.
        /// </summary>
        /// <returns>List of types.</returns>
        [Authorize, HttpGet("getTypes")]
        public async Task<IActionResult> GetTypes()
        {
            var list = new List<object>();
            foreach (MatchTypeEnum type in Enum.GetValues(typeof(MatchTypeEnum)))
            {
                list.Add(new { id = type, name = type.GetNameAttribute() });
            }
            return Ok(await Task.FromResult(list));
        }

        /// <summary>
        /// Delete match.
        /// </summary>
        /// <returns>List of types.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            _cacheManager.Remove(CacheKeysConstants.MatchCalendarCacheConst);
            var result = await _matchService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
