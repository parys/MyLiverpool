using System;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Common.Web;
using MyLfc.Common.Web.DistributedCache;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Data.Common;
using Newtonsoft.Json;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Manages injuries.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme, Roles = nameof(RolesEnum.InfoStart)), Route("api/v1/[controller]")]
    public class InjuriesController : Controller
    {
        private readonly IInjuryService _injuryService;
        private readonly IDistributedCacheManager _cacheManager;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="injuryService"></param>
        /// <param name="cacheManager"></param>
        public InjuriesController(IInjuryService injuryService, IDistributedCacheManager cacheManager)
        {
            _injuryService = injuryService;
            _cacheManager = cacheManager;
        }

        /// <summary>
        /// Creates new injury item.
        /// </summary>
        /// <param name="dto">New injury model.</param>
        /// <returns></returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody]InjuryDto dto)
        {
            if (dto == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _injuryService.CreateAsync(dto);
            _cacheManager.Remove(CacheKeysConstants.LastInjuries);
            return Ok(result);
        }

        /// <summary>
        /// Returns pageable injury list.
        /// </summary>
        /// <param name="filters">Applied filters.</param>
        /// <returns>Injuries list.</returns>
        [AllowAnonymous, HttpGet("")]
        [Obsolete("Remove after 1.10.18")]
        public async Task<IActionResult> GetListOldAsync([FromQuery] string filters)
        {
            InjuryFiltersDto filtersObj;
            if (filters == null)
            {
                filtersObj = new InjuryFiltersDto();
            }
            else
            {
                filtersObj = (InjuryFiltersDto)JsonConvert.DeserializeObject(filters, typeof(InjuryFiltersDto));
            }
            var result = await _injuryService.GetListAsync(filtersObj);
            return Ok(result);
        }

        /// <summary>
        /// Returns pageable injury list.
        /// </summary>
        /// <param name="filters">Applied filters.</param>
        /// <returns>Injuries list.</returns>
        [AllowAnonymous, HttpGet("{filters}")]
        public async Task<IActionResult> GetListAsync([FromRoute] string filters)
        {
            InjuryFiltersDto filtersObj;
            if (filters == null)
            {
                filtersObj = new InjuryFiltersDto();
            }
            else
            {
                filtersObj = (InjuryFiltersDto)JsonConvert.DeserializeObject(filters, typeof(InjuryFiltersDto));
            }
            var result = await _injuryService.GetListAsync(filtersObj);
            return Ok(result);
        }

        /// <summary>
        /// Returns injury by id.
        /// </summary>
        /// <param name="id">The identifier of injury.</param>
        /// <returns>Injury model.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            var result = await _injuryService.GetByIdAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// Updates injury.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="dto">Modified injury entity.</param>
        /// <returns>Returns of editing.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("{id:int}")]
        public async Task<IActionResult> EditAsync(int id, [FromBody]InjuryDto dto)
        {
            if (id != dto.Id || !ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _injuryService.UpdateAsync(dto);
            _cacheManager.Remove(CacheKeysConstants.LastInjuries);
            return Ok(result);
        }

        /// <summary>
        /// Deletes injury.
        /// </summary>
        /// <param name="id">The identifier of deleting injury.</param>
        /// <returns>Result of deleting.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _injuryService.DeleteAsync(id);
            _cacheManager.Remove(CacheKeysConstants.LastInjuries);
            return Ok(result);
        }

        /// <summary>
        /// Returns injuries list for current moment.
        /// </summary>
        /// <returns>List with injuries.</returns>
        [AllowAnonymous, HttpGet("current")]
        public async Task<IActionResult> GetCurrentListAsync()
        {
            var result = await _cacheManager.GetOrCreateAsync(CacheKeysConstants.LastInjuries,
                async () => await _injuryService.GetCurrentListAsync());
            return Json(result);
        }
    }
}
