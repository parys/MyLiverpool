using System;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Data.Common;
using Newtonsoft.Json;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Manages seasons.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class SeasonsController : Controller
    {
        private readonly ISeasonService _seasonService;
        private readonly IMatchEventService _matchEventService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="seasonService"></param>
        /// <param name="matchEventService"></param>
        public SeasonsController(ISeasonService seasonService, IMatchEventService matchEventService)
        {
            _seasonService = seasonService;
            _matchEventService = matchEventService;
        }

        /// <summary>
        /// Returns seasons list.
        /// </summary>
        /// <returns>List with seasons.</returns>
        [AllowAnonymous, HttpGet]
        public async Task<IActionResult> GetListAsync()
        {
            var result = await _seasonService.GetListAsync();
            return Json(result);
        }

        /// <summary>
        /// Returns wishes list by filter.
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
            var obj = JsonConvert.DeserializeObject<SeasonFiltersDto>(dto, new JsonSerializerSettings() //todo should be application wide settings
            {
                MissingMemberHandling = MissingMemberHandling.Ignore,
                NullValueHandling = NullValueHandling.Include,
                DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate
            });

            var model = await _seasonService.GetListAsync(obj);
            return Json(model);
        }

        /// <summary>
        /// Returns season by id.
        /// </summary>
        /// <param name="id">The identifier of season.</param>
        /// <returns>Found season by id.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            var result = await _seasonService.GetByIdAsync(id);
            return Json(result);
        }

        /// <summary>
        /// Returns season by id with matches.
        /// </summary>
        /// <param name="id">The identifier of season.</param>
        /// <returns>Found season by id with matches.</returns>
        [AllowAnonymous, HttpGet("getWithMatches/{id:int}")]
        public async Task<IActionResult> GetWithMatchesAsync(int id)
        {
            var result = await _seasonService.GetByIdWithMatchesAsync(id);
            return Json(result);
        }

        /// <summary>
        /// Returns statistics for season.
        /// </summary>
        /// <param name="id">The identifier of season.</param>
        /// <returns>Statistics for season.</returns>
        [AllowAnonymous, HttpGet("{id:int}/statistics")]
        public async Task<IActionResult> GetStatisticsAsync(int id)
        {
            var result = await _matchEventService.GetStatisticsAsync(id);
            return Json(result);
        }

        /// <summary>
        /// Creates new season.
        /// </summary>
        /// <param name="dto">Filled dto for new season.</param>
        /// <returns>Created season objec.t</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody] SeasonDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(dto);
            }
            var result = await _seasonService.CreateAsync(dto);
            return Json(result);
        }

        /// <summary>
        /// Updates season.
        /// </summary>
        /// <param name="id">The identifier of updatable object.</param>
        /// <param name="dto">Filled dto contains new values.</param>
        /// <returns>Updated season object.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] SeasonDto dto)
        {
            if (!ModelState.IsValid || id != dto.Id)
            {
                return BadRequest();
            }
            var result = await _seasonService.UpdateAsync(dto);
            return Json(result);
        }

        /// <summary>
        /// Deletes season.
        /// </summary>
        /// <param name="id">The identifier of removing object.</param>
        /// <returns>Result of deleting season.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _seasonService.DeleteAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// Deletes season.
        /// </summary>
        /// <param name="id">The identifier of removing object.</param>
        /// <returns>Result of deleting season.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoFull)), HttpPut("{id:int}/SetAsCurrent")]
        public async Task<IActionResult> SetAsCurrentAsync(int id)
        {
            await _seasonService.SetCurrentSeasonAsync(id);
            return Ok(true);
        }

        /// <summary>
        /// Returns seasons which year contain types string.
        /// </summary>
        /// <param name="typed">Part of season year for search.</param>
        /// <returns>List of keyValuePair of seasons with identifiers.</returns>
        [AllowAnonymous, HttpGet("getSeasonsByYear")]
        [Obsolete("Remove after 11.11.18")]
        public async Task<IActionResult> GetSeasonsByYearAsync([FromQuery]string typed)
        {
            var result = await _seasonService.GetSeasonsByYearAsync(typed);
            return Ok(result);
        }
    }
}
