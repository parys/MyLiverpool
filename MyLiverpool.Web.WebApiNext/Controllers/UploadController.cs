﻿using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Data.Entities;
using MyLiverpool.Web.WebApiNext.Extensions;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages for uploads.
    /// </summary>
    [Route("api/[controller]")]
    [Authorize]
    public class UploadController : Controller
    {
        private readonly IUploadService _uploadService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="uploadService"></param>
        public UploadController(IUploadService uploadService)
        {
            _uploadService = uploadService;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [Route("avatar")]
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> UploadAvatar(int userId)
        {
            if (!User.IsInRole(nameof(RolesEnum.UserStart)) && User.GetUserId() != userId)
            {
                return StatusCode((int) HttpStatusCode.Forbidden);
            }
          //  if (!Request.Form.IsMimeMultipartContent())
          //  {
         //       return BadRequest();
          //  }

            if (Request.Form.Files != null && Request.Form.Files.Count > 0)
            {
              //  if (HttpContext.Current.Request.Files !=.Count > 0)
                {
                    var file = Request.Form.Files[0];
                    var result = await _uploadService.UpdateAvatarAsync(userId, file);

                    return Ok(result);
                }
            }
            return BadRequest();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="clubId"></param>
        /// <returns></returns>
        [Route("clubLogo")]
        [HttpPost]
        [Authorize(Roles = "AdminStart")]
        public async Task<IActionResult> ClubLogo(int? clubId)
        {
            //if (!Request.Content.IsMimeMultipartContent())
            //{
            //    return BadRequest();
            //}

            if (Request.Form.Files != null && Request.Form.Files.Count > 0)
            {
            //    if (HttpContext.Current.Request.Files.Count > 0)
                {
                    var file = Request.Form.Files[0];
                    var result = await _uploadService.UpdateLogoAsync(clubId, file);

                    return Ok(result);
                }
            }
            return BadRequest();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = "NewsStart,BlogStart")]
        [Route("Images")]
        [HttpPost]
        public async Task<IActionResult> UploadImages()
        {
            //if (!Request.Content.IsMimeMultipartContent())
            //{
            //    return BadRequest();
            //}

            if (Request.Form.Files != null && Request.Form.Files.Count > 0)
            {
               // if (HttpContext.Current.Request.Files.Count > 0)
                {
                    var files = Request.Form.Files;
                    var result = await _uploadService.UploadAsync(files);

                    return Ok(result);
                }
            }
            return BadRequest();
        }
    }
}
