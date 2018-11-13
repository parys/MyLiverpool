using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Common.Web;
using MyLfc.Common.Web.DistributedCache;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Controller for manage admin functions.
    /// </summary>
    [Authorize(Roles = nameof(RolesEnum.AdminStart)), Route("api/v1/[controller]")]
    public class AdminController : Controller
    {
        private readonly IAdminService _adminService;
        private readonly IDistributedCacheManager _cacheManager;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="adminService"></param>
        /// <param name="cache"></param>
        public AdminController(IAdminService adminService, IDistributedCacheManager cache)
        {
            _adminService = adminService;
            _cacheManager = cache;
        }

        /// <summary>
        /// Updates epl table.
        /// </summary>
        /// <returns>Result of update.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpGet("updateTable")]
        public async Task<IActionResult> UpdateEplTable()
        {
            var result = await _adminService.UpdateTableAsync();
            _cacheManager.SetString(GlobalConstants.HelperEntity + (int)HelperEntityType.EplTable, result);
            return Ok(result);
        }
    }
}