using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Common.Web.DistributedCache;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages common things.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class HelpersController: Controller
    {
        private readonly IHelperService _helperService;
        private readonly IDistributedCacheManager _cacheManager;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="helperService"></param>
        /// <param name="cache"></param>
        public HelpersController(IHelperService helperService, IDistributedCacheManager cache)
        {
            _helperService = helperService;
            _cacheManager = cache;
        }

        /// <summary>
        /// Returns helper entity value.
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous, HttpGet("value/{id:int}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            var result = await _cacheManager.GetOrCreateStringAsync(GlobalConstants.HelperEntity + id,
                async () => await _helperService.GetValueAsync((HelperEntityType) id));
            return Ok(result);
        }

        /// <summary>
        /// Updates page content.
        /// </summary>
        /// <returns>Result of update.</returns>
        [Authorize(Roles = nameof(RolesEnum.AdminStart)), HttpPut("value/{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody]string value)
        {
            var result = await _helperService.CreateOrUpdateAsync((HelperEntityType)id, value);
            _cacheManager.SetString(GlobalConstants.HelperEntity + id, value);
            return Json(result);
        }
    }
}
