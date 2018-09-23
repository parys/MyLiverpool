using System;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages forum messages.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class ForumMessagesController : Controller
    {
        private readonly IForumMessageService _forumMessageService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="forumMessageService"></param>
        public ForumMessagesController(IForumMessageService forumMessageService)
        {
            _forumMessageService = forumMessageService;
        }

        /// <summary>
        /// Creates new forum message.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns>Result of creation message.</returns>
        [Authorize, HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody]ForumMessageDto dto)
        {
            dto.AuthorId = User.GetUserId();
            dto.AdditionTime = DateTime.Now;//maybe move dates to frontend?
            dto.LastModifiedTime = DateTime.Now;
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _forumMessageService.CreateAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Updates forum comment.
        /// </summary>
        /// <param name="id">The identifier of comment.</param>
        /// <param name="dto">Comment.</param>
        /// <returns>Result of update.</returns>
        [Authorize, HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] ForumMessageDto dto)
        {
            if (id != dto.Id || !ModelState.IsValid)
            {
                return BadRequest();
            }

            if (!User.IsInRole(nameof(RolesEnum.UserStart)) && User.GetUserId() != dto.AuthorId)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            var result = await _forumMessageService.UpdateAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Deletes forum comment.
        /// </summary>
        /// <param name="id">The identifier of comment.</param>
        /// <returns>Result of deleting.</returns>
        [Authorize(Roles = nameof(RolesEnum.UserStart)), HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _forumMessageService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
