using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Common.Utilities.Extensions;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Manages roles.
    /// </summary>
    [Authorize, Route("api/v1/[controller]")]
    public class RoleController : Controller
    {
        private readonly IRoleService _roleService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="roleService"></param>
        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        /// <summary>
        /// Gets current user roles.
        /// </summary>
        /// <returns>List of current user roles.</returns>
        [Authorize, HttpGet("")]
        public async Task<IActionResult> GetUserRolesAsync()
        {
            var userId = User.GetUserId();
            var roles = await _roleService.GetUserRolesAsync(userId);
            return Json(new { userId, roles });
        }
    }
}
