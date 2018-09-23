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
    /// <summary>
    /// Manages stadiums.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class StadiumsController: Controller
    {
        private readonly IStadiumService _stadiumService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="stadiumService"></param>
        public StadiumsController(IStadiumService stadiumService)
        {
            _stadiumService = stadiumService;
        }

        /// <summary>
        /// Returns stadium by id.
        /// </summary>
        /// <param name="id">The identifier of stadium.</param>
        /// <returns>Found stadium.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            var stadium = await _stadiumService.GetByIdAsync(id);
            return Ok(stadium);
        }

        /// <summary>
        /// Returns stadiums list by filter.
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
            var obj = JsonConvert.DeserializeObject<StadiumFiltersDto>(dto, new JsonSerializerSettings() //todo should be application wide settings
            {
                MissingMemberHandling = MissingMemberHandling.Ignore,
                NullValueHandling = NullValueHandling.Include,
                DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate
            });

            var model = await _stadiumService.GetListAsync(obj);
            return Json(model);
        }

        /// <summary>
        /// Returns top 10 stadiums by name.
        /// </summary>
        /// <param name="typed">The part of name of stadium.</param>
        /// <returns>Found stadiums.</returns>
        [AllowAnonymous, HttpGet("getListByName")]
        [Obsolete("Remove after 11.11.18")]
        public async Task<IActionResult> GetListByNameAsync([FromQuery]string typed)
        {
            var stadium = await _stadiumService.GetListByNameAsync(typed);
            return Ok(stadium);
        }

        /// <summary>
        /// Returns list of stadiums.
        /// </summary>
        /// <param name="page">The identifier of stadium.</param>
        /// <returns>List with stadiums.</returns>
        [AllowAnonymous, HttpGet]
        public async Task<IActionResult> GetListAsync([FromQuery]int page)
        {
            var stadium = await _stadiumService.GeListAsync(page);
            return Ok(stadium);
        }

        //bug temporary
        /// <summary>
        /// Returns list of stadiums.
        /// </summary>
        /// <returns>List with stadiums.</returns>
        [AllowAnonymous, HttpGet("listAll")]
        public async Task<IActionResult> GetListAsync()
        {
            var stadium = await _stadiumService.GeListAsync();
            return Ok(stadium);
        }

        /// <summary>
        /// Creates new stadium.
        /// </summary>
        /// <param name="dto">Filled dto for new stadium.</param>
        /// <returns>Created stadium.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody] StadiumDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(dto);
            }
            var result = await _stadiumService.CreateAsync(dto);
            return Json(result);
        }

        /// <summary>
        /// Updates season.
        /// </summary>
        /// <param name="id">The identifier of updatable object.</param>
        /// <param name="dto">Filled dto contains new values.</param>
        /// <returns>Updated season object.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] StadiumDto dto)
        {
            if (!ModelState.IsValid || id != dto.Id)
            {
                return BadRequest();
            }
            var result = await _stadiumService.UpdateAsync(dto);
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
            var result = await _stadiumService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
