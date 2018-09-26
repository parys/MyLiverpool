using System;
using System.Net;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Common.Web;
using MyLfc.Common.Web.DistributedCache;
using MyLfc.Common.Web.OnlineCounting;
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
    /// Manages users.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;
        private readonly IRoleService _roleService;
        private readonly IUploadService _uploadService;//todo should call remove and method move to user service
        private readonly IDistributedCacheManager _cacheManager;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="userService"></param>
        /// <param name="uploadService"></param>
        /// <param name="cache"></param>
        /// <param name="roleService"></param>
        public UsersController(IUserService userService, IUploadService uploadService, IDistributedCacheManager cache, IRoleService roleService)
        {
            _userService = userService;
            _uploadService = uploadService;
            _cacheManager = cache;
            _roleService = roleService;
        }
        
        /// <summary>
        /// Returns current user id.
        /// </summary>
        /// <returns>User id.</returns>
        [Authorize, HttpGet("GetId")]
        public IActionResult GetId()
        {
            return Ok(User.GetUserId());
        }
        
        /// <summary>
        /// Returns user by id.
        /// </summary>
        /// <param name="id">The identifier of user.</param>
        /// <returns>Found user.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            if (id == 0)
            {
                id = User?.GetUserId() ?? 0;
            }
            if (id == 0)
            {
                return BadRequest();
            }
            var user = await _userService.GetUserAsync(id);
            if (User == null || !User.Identity.IsAuthenticated ||
                (!User.IsInRole(nameof(RolesEnum.AdminStart)) && User.GetUserId() != user.Id))
            {
                user.Email = null;
                user.Ip = null;
            }
            return Json(user);
        }

        /// <summary>
        /// Updates user.
        /// </summary>
        /// <param name="dto">Modified user entity.</param>
        /// <returns>Result of editing.</returns>
        [Authorize, HttpPut]
        [Obsolete("remove after 01.10.18")]
        public async Task<IActionResult> UpdateAsync([FromBody]UserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            dto.Id = User.GetUserId();
            var result = await _userService.UpdateAsync(dto);
            _cacheManager.Remove(CacheKeysConstants.UserBirthdays);
            return Ok(result);
        }

        /// <summary>
        /// Updates user.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="dto">Modified user entity.</param>
        /// <returns>Result of editing.</returns>
        [Authorize, HttpPut]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody]UserDto dto)
        {
            if (id != dto.Id && id != User.GetUserId() || !ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _userService.UpdateAsync(dto);
            _cacheManager.Remove(CacheKeysConstants.UserBirthdays);
            return Ok(result);
        }

        /// <summary>
        /// Returns filtered users list.
        /// </summary>
        /// <param name="dto">Filters.</param>
        /// <returns>List with users.</returns>
        [AllowAnonymous, HttpGet("{dto}")]
        public async Task<IActionResult> List(string dto)
        {
            if (string.IsNullOrWhiteSpace(dto))
            {
                return BadRequest();
            }
            var obj = JsonConvert.DeserializeObject<UserFiltersDto>(dto, new JsonSerializerSettings() //todo should be application wide settings
            {
                MissingMemberHandling = MissingMemberHandling.Ignore,
                NullValueHandling = NullValueHandling.Include,
                DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate
            });

            if (!User.IsInRole(nameof(RolesEnum.AdminStart)))
            {
                obj.Ip = null;
            }
            var model = await _userService.GetUsersDtoAsync(obj);
            return Json(model);
        }

        /// <summary>
        /// Updates user group.
        /// </summary>
        /// <param name="userId">The identifier of updatable user.</param>
        /// <param name="roleGroupId">New role group id.</param>
        /// <returns>Result of updating role group.</returns>
        [Authorize(Roles = nameof(RolesEnum.AdminStart)), HttpPut("updateRoleGroup/{userId:int}/{roleGroupId:int}")]
        public async Task<IActionResult> UpdateRole(int userId, int roleGroupId)
        {
            if (userId == User.GetUserId())
            {
                return BadRequest("Cannot update role by self.");
            }
            var result = await _roleService.EditRoleGroupAsync(roleGroupId, userId);
            return Ok(result);
        }
        
        /// <summary>
        /// Returns first 
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous, HttpGet("online")]
        public IActionResult GetOnlineCounter()
        {
            return Json(OnlineUsers.GetStats());
        }

        /// <summary>
        /// Returns current user config.
        /// </summary>
        /// <returns>Config.</returns>
        [Authorize, HttpGet("config")]
        public async Task<IActionResult> GetConfigAsync()
        {
            var result = await _userService.GetUserConfigAsync(User.GetUserId());
            return Json(result);
        }

        /// <summary>
        /// Returns users list who celebrate birthday today.
        /// </summary>
        /// <returns>Users who celebrates birthday today.</returns>
        [AllowAnonymous, HttpGet("birthdays")]
        public async Task<IActionResult> GetBirthdaysAsync()
        {
            var result = await _cacheManager.GetOrCreateAsync(CacheKeysConstants.UserBirthdays + DateTime.Today,
                async () => await _userService.GetBirthdaysAsync());
            return Json(result);
        }

        /// <summary>
        /// Updates current user config.
        /// </summary>
        /// <returns>Updated config.</returns>
        [Authorize, HttpPut("config")]
        public async Task<IActionResult> UpdateConfigAsync([FromBody]UserConfigDto dto)
        {
            var result = await _userService.UpdateUserConfigAsync(dto, User.GetUserId());
            return Json(result);
        }

        /// <summary>
        /// Bans user.
        /// </summary>
        /// <param name="userId">The identifier of blocking user.</param>
        /// <param name="daysCount"></param>
        /// <returns>Result of block user.</returns>
        [Authorize(Roles = nameof(RolesEnum.UserStart)), HttpPut("Ban/{userId:int}/{daysCount:int}")]
        public async Task<IActionResult> BanUser(int userId, int daysCount)
        {
            var result = await _userService.BanUser(userId, daysCount);
            return Ok(result);
        }

        /// <summary>
        /// Unbans user.
        /// </summary>
        /// <param name="userId">The identifier of unblocking user.</param>
        /// <returns>Result of unblocking user.</returns>
        [Authorize(Roles = nameof(RolesEnum.UserFull)), HttpPut("Unban/{userId:int}")]
        public async Task<IActionResult> UnbanUser(int userId)
        {
            var result = await _userService.UnbanUser(userId);
            return Ok(result);
        }

        // <param name="userId">The identifier of updatable user.</param>
        /// <summary>
        /// Uploads a new user's avatar.
        /// </summary>
        /// <returns>Result of uploading new avatar.</returns>
        [Authorize, HttpPost("avatar")]
        public async Task<ActionResult> UploadAvatarAsync()
        {
            if (Request.Form.Files != null && Request.Form.Files.Count > 0)
            {
                //  if (HttpContext.Current.Request.Files !=.Count > 0)
                {
                    var file = Request.Form.Files[0];
                    var result = await _uploadService.UpdateAvatarAsync(User.GetUserId(), file);

                    return Json(new { path = result});
                }
            }
            return BadRequest();
        }

        /// <summary>
        /// Resets user's avatar to default.
        /// </summary>
        /// <param name="userId">The identifier of resetting avatar user.</param>
        /// <returns>New user photo path.</returns>
        [Authorize, HttpPut("avatar/{userId:int}/reset")]
        public async Task<ActionResult> ResetAvatarAsync(int userId)
        {
            if (!User.IsInRole(nameof(RolesEnum.UserStart)) && User.GetUserId() != userId)
            {
                return StatusCode((int)HttpStatusCode.Forbidden);
            }
            var result = await _userService.ResetAvatarAsync(userId);
            return Json(new { path = result });
        }
    }
}
