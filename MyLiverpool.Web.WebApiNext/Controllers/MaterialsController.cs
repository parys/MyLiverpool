using System;
using System.Linq;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
    /// <summary>
    /// Manages materials.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class MaterialsController : Controller
    {
        private readonly IMaterialService _materialService;
        private readonly ILogger<MaterialsController> _logger;
        private readonly IDistributedCacheManager _cacheManager;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="materialService">Injecting materialService.</param>
        /// <param name="logger">Injecting logger.</param>
        /// <param name="cacheManager"></param>
        public MaterialsController(IMaterialService materialService, ILogger<MaterialsController> logger, IDistributedCacheManager cacheManager)
        {
            _materialService = materialService;
            _logger = logger;
            _cacheManager = cacheManager;
        }

        /// <summary>
        /// Returns list of filtered materials.  
        /// </summary>
        /// <param name="filtersObj">Contains filters.</param>
        /// <returns>List of materials.</returns>
        [AllowAnonymous, HttpGet("{filtersObj}")]
        public async Task<IActionResult> GetListItems([FromRoute] string filtersObj)
        {
           // _logger.LogError(Process.GetCurrentProcess().Threads.Count.ToString());
            MaterialFiltersDto filters;
            if (filtersObj == null)
            {
                filters = GetBasicMaterialFilters(false);
            }
            else
            {
                filters = (MaterialFiltersDto) JsonConvert.DeserializeObject(filtersObj, typeof(MaterialFiltersDto));
            }
            filters.IsInNewsmakerRole = User.IsInRole(nameof(RolesEnum.NewsStart)) || User.IsInRole(nameof(RolesEnum.BlogStart));
            PageableData<MaterialMiniDto> result;
            if (filters.Page == 1 && !filters.IsInNewsmakerRole && filters.MaterialType == MaterialType.Both)
            {
                result = await _cacheManager.GetOrCreateAsync(CacheKeysConstants.MaterialList,
                    async () => await _materialService.GetDtoAllAsync(filters));
            }
            else
            {
                result = await _materialService.GetDtoAllAsync(filters);
            }
            return Ok(result);
        }

        /// <summary>
        /// Gets material by id.
        /// </summary>
        /// <param name="id">Material identifier.</param>
        /// <returns>Found material.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetItem(int id)
        {
            var hasAccess = User != null && (User.IsInRole(nameof(RolesEnum.NewsStart)) || User.IsInRole(nameof(RolesEnum.BlogStart)));

            var model = await _cacheManager.GetOrCreateAsync(CacheKeysConstants.Material + id, async () => await _materialService.GetDtoAsync(id, hasAccess));
            if (model.Pending)
            {
                if((model.Type == MaterialType.News || User.GetUserId() != model.UserId) &&
                    (User == null || !User.IsInRole(nameof(RolesEnum.NewsStart))))
                {
                    return BadRequest();
                }
            }
            return Ok(model);
        }

        /// <summary>
        /// Removes material.
        /// </summary>
        /// <param name="id">Material identifier.</param>
        /// <returns>Result of removing.</returns>
        [Authorize(Roles = nameof(RolesEnum.NewsStart) + "," + nameof(RolesEnum.BlogStart)), HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _materialService.DeleteAsync(id, User);
            _cacheManager.Remove(CacheKeysConstants.Material + id);
            _cacheManager.Remove(CacheKeysConstants.MaterialList);
            return Json(result);
        }

        /// <summary>
        /// Activates material.
        /// </summary>
        /// <param name="id">Material identifier.</param>
        /// <returns>Result of activation.</returns>
        [Authorize(Roles = nameof(RolesEnum.NewsFull) + "," + nameof(RolesEnum.BlogFull)), HttpGet("activate/{id:int}")]
        public async Task<IActionResult> ActivateAsync(int id)
        {
            var result = await _materialService.ActivateAsync(id, User);
            if (result != null)
            {
                _cacheManager.Remove(CacheKeysConstants.MaterialList);
                _cacheManager.Set(CacheKeysConstants.Material + id, result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Creates new material.
        /// </summary>
        /// <param name="type">Material type.</param>
        /// <param name="model">Contains material model.</param>
        /// <returns>Result of creation.</returns>
        [Authorize(Roles = nameof(RolesEnum.NewsStart) + "," + nameof(RolesEnum.BlogStart)), HttpPost("{type}")]//todo add cutting absolute path to relative
        public async Task<IActionResult> CreateAsync(string type, [FromBody] MaterialDto model)
        {
            if (!ModelState.IsValid || !Enum.TryParse(type, true, out MaterialType materialType))
            {
                return BadRequest(ModelState);
            }
            model.Type = materialType;
            if (!User.IsInRole(nameof(RolesEnum.NewsFull)) && 
                !User.IsInRole(nameof(RolesEnum.BlogFull)))
            {
                model.Pending = true;
            }
            var result = await _materialService.CreateAsync(model, User.GetUserId());
            if (!model.Pending)
            {
                _cacheManager.Remove(CacheKeysConstants.MaterialList);
            }
            return Ok(result);
        }


        /// <summary>
        /// Updates material.
        /// </summary>
        /// <param name="id">Material identifier.</param>
        /// <param name="model">Contains material model.</param>
        /// <returns>Result of updation.</returns>
        [Authorize(Roles = nameof(RolesEnum.NewsStart) + "," + nameof(RolesEnum.BlogStart)), HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody]MaterialDto model)//todo add cutting absolute path to relative
        {
            if (id != model.Id)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!User.IsInRole(nameof(RolesEnum.NewsFull)) && 
                !User.IsInRole(nameof(RolesEnum.BlogFull)))
            {
                if (model.UserId != User?.GetUserId())
                {
                    return Unauthorized();
                }
                model.Pending = true;
            }
            var result = await _materialService.EditAsync(model);
            _cacheManager.Set(CacheKeysConstants.Material + id, result);
            _cacheManager.Remove(CacheKeysConstants.MaterialList);
            return Ok(result);
        }

        /// <summary>
        /// Adds view to material.
        /// </summary>
        /// <param name="id">Material identifier.</param>
        /// <returns>Result of addition view.</returns>
        [AllowAnonymous, HttpGet("AddView/{id:int}")]
        public async Task<IActionResult> AddViewAsync(int id)
        {
            await _materialService.AddViewAsync(id);
            UpdateMaterialCacheAddViewAsync(id);
            return Json(true);
        }

        /// <summary>
        /// Extracts and returns file linls for images.
        /// </summary>
        /// <param name="url">Url of page with images.</param>
        /// <returns>Found images links.</returns>
        [Authorize(Roles = nameof(RolesEnum.NewsStart)), HttpGet("imageLinks/{*url}")]
        public async Task<IActionResult> GetExtractedImageLinksAsync(string url)
        {
            var fileLinks = await _materialService.GetExtractedImageLinks(url);
            return Json(fileLinks);
        }

        private MaterialFiltersDto GetBasicMaterialFilters(bool isNewsMaker)
        {
            return new MaterialFiltersDto {
                Page = 1,
                MaterialType = MaterialType.Both,
                IsInNewsmakerRole = isNewsMaker
            };
        }

        private async void UpdateMaterialCacheAddViewAsync(int materialId)
        {
            var materialCache = await _cacheManager.GetAsync<MaterialDto>(CacheKeysConstants.Material + materialId);
            if (materialCache != null)
            {
                materialCache.Reads++;
                _cacheManager.Set(CacheKeysConstants.Material + materialId, materialCache);
            }

            var materialsCache = await _cacheManager.GetAsync<PageableData<MaterialMiniDto>>(CacheKeysConstants.MaterialList);

            var material = materialsCache?.List.FirstOrDefault(x => x.Id == materialId);
            if (material != null)
            {
                material.Reads++;
                _cacheManager.Set(CacheKeysConstants.MaterialList, materialsCache);
            }
        }
    }
}