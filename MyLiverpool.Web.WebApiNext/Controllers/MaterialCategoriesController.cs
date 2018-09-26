using System;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages news categories.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class MaterialCategoriesController : Controller
    {
        private readonly IMaterialCategoryService _materialCategoryService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="materialCategoryService"></param>
        public MaterialCategoriesController(IMaterialCategoryService materialCategoryService)
        {
            _materialCategoryService = materialCategoryService;
        }

        /// <summary> 
        /// Returns material category by id.
        /// </summary>
        /// <param name="id">The identifier of searching category.</param>
        /// <returns>Material category.</returns>
        [Authorize, HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _materialCategoryService.GetAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// Returns material categories list with given type.
        /// </summary>
        /// <param name="type">Material type.</param>
        /// <returns>Material categories list.</returns>
        [AllowAnonymous, HttpGet("{type}")]
        public async Task<IActionResult> Get(string type)
        {
            MaterialType parsedType;
            if (!Enum.TryParse(type, true, out parsedType))
            {
                return BadRequest("Cannot parse material type!");
            }
            var result = await _materialCategoryService.GetListAsync(parsedType);
            return Ok(result);
        }

        /// <summary>
        /// Creates new material category.
        /// </summary>
        /// <param name="type">The type of new category.</param>
        /// <param name="dto">Filled dto for new category.</param>
        /// <returns>Created category object</returns>
        [Authorize(Roles = nameof(RolesEnum.NewsFull) + "," + nameof(RolesEnum.BlogFull)), HttpPost("{type}")]
        public async Task<IActionResult> CreateAsync(string type, [FromBody] MaterialCategoryDto dto)
        {
            MaterialType parsedType;
            if (!Enum.TryParse(type, true, out parsedType))
            {
                return BadRequest("Cannot parse material type!");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            dto.MaterialType = parsedType;
            var result = await _materialCategoryService.CreateAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Updates material category.
        /// </summary>
        /// <param name="id">The identifier of updatable object.</param>
        /// <param name="dto">Filled dto contains new values.</param>
        /// <returns>Updated category object.</returns>
        [Authorize(Roles = nameof(RolesEnum.NewsFull) + "," + nameof(RolesEnum.BlogFull)), HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] MaterialCategoryDto dto)
        {
            if (!ModelState.IsValid || id != dto.Id)
            {
                return BadRequest();
            }
            var result = await _materialCategoryService.UpdateAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Deletes material category.
        /// </summary>
        /// <param name="id">The identifier of removing object.</param>
        /// <returns>Result of deleting.</returns>
        [Authorize(Roles = nameof(RolesEnum.NewsFull) + "," + nameof(RolesEnum.BlogFull)), HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _materialCategoryService.DeleteAsync(id);
            return Ok(result);
        }
    }
}