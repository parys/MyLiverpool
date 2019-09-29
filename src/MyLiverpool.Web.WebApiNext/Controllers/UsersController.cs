using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Application.Users;
using MyLfc.Common.Web;
using MyLfc.Common.Web.OnlineCounting;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Manages users.
    /// </summary>
    public class UsersController : BaseController
    {
        /// <summary>
        /// Returns user by id.
        /// </summary>
        /// <param name="request">The identifier of user.</param>
        /// <returns>Found user.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute]GetUserDetailQuery.Request request)
        {
            if (request.Id == 0)
            {
                request.Id = User?.GetUserId() ?? 0;
            }
            if (request.Id == 0)
            {
                return BadRequest();
            }
            var user = await Mediator.Send(request);
          
            return Ok(user);
        }

        /// <summary>
        /// Updates user.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="request"></param>
        /// <returns>Result of editing.</returns>
        [Authorize, HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync([FromRoute]int id, [FromBody]UpdateUserCommand.Request request)
        {
            if (id != User.GetUserId())
            {
                return BadRequest();
            }
            var result = await Mediator.Send(request);
            CacheManager.Remove(CacheKeysConstants.UserBirthdays);
            return Ok(result);
        }

        /// <summary>
        /// Returns filtered users list.
        /// </summary>
        /// <param name="request">Filters.</param>
        /// <returns>List with users.</returns>
        [AllowAnonymous, HttpGet("")]
        public async Task<IActionResult> List([FromQuery]GetUserListQuery.Request request)
        {
            if (!User.IsInRole(nameof(RolesEnum.AdminStart)))
            {
                request.Ip = null;
            }

            var result = await Mediator.Send(request);
            return Ok(result);
        }

        /// <summary>
        /// Updates user group.
        /// </summary>
        /// <param name="request">UserId and roleGroupId.</param>
        /// <returns>Result of updating role group.</returns>
        [Authorize(Roles = nameof(RolesEnum.AdminStart)), HttpPut("{userId:int}/roleGroup/{roleGroupId:int}")]
        public async Task<IActionResult> UpdateRole([FromRoute]SetUserRoleGroupCommand.Request request)
        {
            if (request.UserId == User.GetUserId())
            {
                return BadRequest("Cannot update role by self.");
            }
            return Ok(await Mediator.Send(request));
        }
        
        /// <summary>
        /// Returns first 
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous, HttpGet("online")]
        public IActionResult GetOnlineCounter()
        {
            return Ok(OnlineUsers.GetStats());
        }

        /// <summary>
        /// Returns current user config.
        /// </summary>
        /// <returns>Config.</returns>
        [Authorize, HttpGet("config")]
        public async Task<IActionResult> GetConfigAsync()
        {
            return Ok(await Mediator.Send(new GetUserConfigQuery.Request {UserId = User.GetUserId()}));
        }

        /// <summary>
        /// Returns users list who celebrate birthday today.
        /// </summary>
        /// <returns>Users who celebrates birthday today.</returns>
        [AllowAnonymous, HttpGet("birthdays")]
        public async Task<IActionResult> GetBirthdaysAsync()
        {
            var result = await CacheManager.GetOrCreateAsync(CacheKeysConstants.UserBirthdays + DateTime.Today,
                async () => await Mediator.Send(new GetUserBirthdaysQuery.Request()));
            return Ok(result.Results);
        }

        /// <summary>
        /// Updates current user config.
        /// </summary>
        /// <returns>Updated config.</returns>
        [Authorize, HttpPut("config")]
        public async Task<IActionResult> UpdateConfigAsync([FromBody]UpdateUserConfigCommand.Request request)
        {
            return Ok(await Mediator.Send(request));
        }

        /// <summary>
        /// Bans user.
        /// </summary>
        /// <param name="request">The identifier of blocking user.</param>
        /// <returns>Result of block user.</returns>
        [Authorize(Roles = nameof(RolesEnum.UserStart)), HttpPut("{id:int}/ban/{days:int}")]
        public async Task<IActionResult> BanUser([FromRoute]BanUserCommand.Request request)
        {
            return Ok(await Mediator.Send(request));
        }

        /// <summary>
        /// Unbans user.
        /// </summary>
        /// <param name="request">The identifier of unblocking user.</param>
        /// <returns>Result of unblocking user.</returns>
        [Authorize(Roles = nameof(RolesEnum.UserFull)), HttpPut("{id:int}/unban")]
        public async Task<IActionResult> UnbanUser([FromRoute]BanUserCommand.Request request)
        {
            return Ok(await Mediator.Send(request));
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
                var request = new UpdateUserAvatarCommand.Request
                {
                    File = Request.Form.Files[0]
                };
                var result = await Mediator.Send(request);

                return Ok(result);
            }

            return BadRequest();
        }

        /// <summary>
        /// Resets user's avatar to default.
        /// </summary>
        /// <param name="request">The identifier of resetting avatar user.</param>
        /// <returns>New user photo path.</returns>
        [Authorize, HttpPut("avatar/{userId:int}/reset")]
        [Obsolete("Delete after 14 Oct 19")]
        public async Task<ActionResult> ResetAvatarOldAsync([FromRoute] ResetUserAvatarCommand.Request request)
        {
            if (!User.IsInRole(nameof(RolesEnum.UserStart)) && User.GetUserId() != request.UserId)
            {
                return StatusCode((int)HttpStatusCode.Forbidden);
            }
            var result = await Mediator.Send(request);
            return Ok(new { path = result });
        }

        /// <summary>
        /// Resets user's avatar to default.
        /// </summary>
        /// <param name="request">The identifier of resetting avatar user.</param>
        /// <returns>New user photo path.</returns>
        [Authorize, HttpPut("{userId:int}/resetAvatar")]
        public async Task<ActionResult> ResetAvatarAsync([FromRoute] ResetUserAvatarCommand.Request request)
        {
            if (!User.IsInRole(nameof(RolesEnum.UserStart)) && User.GetUserId() != request.UserId)
            {
                return StatusCode((int)HttpStatusCode.Forbidden);
            }
            var result = await Mediator.Send(request);
            return Ok(new { path = result });
        }

        /// <summary>
        /// Gets current user roles.
        /// </summary>
        /// <returns>List of current user roles.</returns>
        [Authorize, HttpGet("roles")]
        public async Task<IActionResult> GetUserRolesAsync()
        {
            return Ok(await Mediator.Send(new GetUserRolesQuery.Request()));
        }
    }
}
