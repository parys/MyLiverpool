using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    /// Manages wishes.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class WishesController : Controller
    {
        private readonly IWishService _wishService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="wishService"></param>
        public WishesController(IWishService wishService)
        {
            _wishService = wishService;
        }

        /// <summary>
        /// Creates new wish.
        /// </summary>
        /// <param name="dto">Filled dto for new wish.</param>
        /// <returns>Creation wish.</returns>
        [AllowAnonymous, HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody]WishDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var model = await _wishService.CreateAsync(dto);
            return Ok(model);
        }

        /// <summary>
        /// Updates wish.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="dto">Modified wish entity.</param>
        /// <returns>Result of editing.</returns>
        [Authorize(Roles = nameof(RolesEnum.AdminStart)), HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody]WishDto dto)
        {
            if (id != dto.Id || !ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _wishService.UpdateAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Deletes wish by id.
        /// </summary>
        /// <param name="id">The identifier of deleting wish.</param>
        /// <returns>Result of deleting.</returns>
        [Authorize(Roles = nameof(RolesEnum.AdminStart)), HttpDelete("")]
        public async Task<IActionResult> DeleteAsync([FromQuery]int id)
        {
            var model = await _wishService.DeleteAsync(id);
            return Ok(model);
        }


        /// <summary>
        /// Returns list with wishes.
        /// </summary>
        /// <param name="page">The page of wish list.</param>
        /// <param name="typeId"></param>
        /// <param name="filterText"></param>
        /// <returns>Pageable wish list.</returns>
        [AllowAnonymous, HttpGet]
        public async Task<IActionResult> GetListAsync([FromQuery]int page = 1, [FromQuery]int? typeId = null, [FromQuery]string filterText = null)
        {
            if (page < 1)
            {
                page = 1;
            }
            var model = await _wishService.GetListAsync(page, typeId, filterText);
            return Ok(model);
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
            var obj = JsonConvert.DeserializeObject<WishFiltersDto>(dto, new JsonSerializerSettings() //todo should be application wide settings
            {
                MissingMemberHandling = MissingMemberHandling.Ignore,
                NullValueHandling = NullValueHandling.Include,
                DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate
            });

            var model = await _wishService.GetListAsync(obj);
            return Json(model);
        }

        /// <summary>
        /// Returns wish by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            if (id < 1)
            {
                return BadRequest();
            }
            var model = await _wishService.GetAsync(id);
            return Ok(model);
        }

        /// <summary>
        /// Gets wish types.
        /// </summary>
        /// <returns>Wish types list.</returns>
        [AllowAnonymous, HttpGet("types")]
        public async Task<IActionResult> GetTypes()
        {
            var list = new List<object>();
            foreach (WishType type in Enum.GetValues(typeof(WishType)))
            {
                list.Add(new { id = type, name = type.GetNameAttribute() });
            }
            return Ok(await Task.FromResult(list));
        } 
        
        /// <summary>
        /// Gets wish states.
        /// </summary>
        /// <returns>Wish states list.</returns>
        [AllowAnonymous, HttpGet("states")]
        public async Task<IActionResult> GetStates()
        {
            var list = new List<object>();
            foreach (WishStateEnum type in Enum.GetValues(typeof(WishStateEnum)))
            {
                list.Add(new { id = type, name = type.GetNameAttribute() });
            }
            return Ok(await Task.FromResult(list));
        }
    }
}
