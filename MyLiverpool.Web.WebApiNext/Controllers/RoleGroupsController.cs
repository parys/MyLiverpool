using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages role groups.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme, Roles = nameof(RolesEnum.AdminFull)), Route("api/v1/[controller]")]
    public class RoleGroupsController : Controller
    {
        private readonly IRoleService _roleService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="roleService"></param>
        public RoleGroupsController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        /// <summary>
        /// Returns all role groups with roles.
        /// </summary>
        /// <returns>Role groups list.</returns>
        [AllowAnonymous, HttpGet("listWithRoles")]
        public async Task<IActionResult> GetAllWithRolesAsync()
        {
            var result = await _roleService.GetRoleGroupsWithRolesAsync();
            return Ok(result);
        }

        /// <summary>
        /// Returns all role groups.
        /// </summary>
        /// <returns>Role groups list.</returns>
        [AllowAnonymous, HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _roleService.GetRoleGroupsAsync();
            return Ok(result);
        }
    }
}
