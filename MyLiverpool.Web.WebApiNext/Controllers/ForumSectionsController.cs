using System.Net;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages forum sections.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class ForumSectionsController : Controller
    {
        private readonly IForumSectionService _forumSectionService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="forumSectionService"></param>
        public ForumSectionsController(IForumSectionService forumSectionService)
        {
            _forumSectionService = forumSectionService;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        [Authorize(Roles = nameof(RolesEnum.AdminStart)), HttpPost("")]
        public async Task<IActionResult> CreateSection([FromBody]string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest();
            }
            var result = await _forumSectionService.CreateAsync(name);
            if (result == null)
            {
                return StatusCode((int) HttpStatusCode.Conflict); //new HttpStatusCodeResult(422);
            }
            return Ok(result);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = nameof(RolesEnum.AdminStart)), HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSection(int id)
        {
            var result = await _forumSectionService.DeleteAsync(id);
            return Ok(result);
        }

        //[Route("")]
        //[HttpGet]
        //[AllowAnonymous]
        //public async Task<IActionResult> Get()
        //{
        //    var result = await _forumSectionService.GetValueAsync();
        //    return Ok(result);
        //}

        /// <summary>
        /// Returns section by id.
        /// </summary>
        /// <param name="id">The identifier of section.</param>
        /// <returns>Section.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> Get([FromQuery]int id)
        {
            var result = await _forumSectionService.GetAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// Returns list of all sections.
        /// </summary>
        /// <returns>Sections list.</returns>
        [AllowAnonymous, HttpGet]
        public async Task<IActionResult> List()
        {
            var hasAdminAccess = User.Identity.IsAuthenticated
                                  && User.IsInRole(nameof(RolesEnum.AdminStart))
                                  || User.IsInRole(nameof(RolesEnum.BlogStart))
                                  || User.IsInRole(nameof(RolesEnum.InfoStart))
                                  || User.IsInRole(nameof(RolesEnum.NewsStart))
                                  || User.IsInRole(nameof(RolesEnum.UserStart));
            var result = await _forumSectionService.GetListAsync(hasAdminAccess);
            return Ok(result);
        }
    }
}
