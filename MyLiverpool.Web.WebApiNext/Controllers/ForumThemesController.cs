using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Common.Utilities.Extensions;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages forum themes.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class ForumThemesController : Controller
    {
        private readonly IForumThemeService _forumThemeService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="forumThemeService"></param>
        public ForumThemesController(IForumThemeService forumThemeService)
        {
            _forumThemeService = forumThemeService;
        }

        /// <summary>
        /// Gets theme with messages on requested page.
        /// </summary>
        /// <param name="id">The identifier of forum theme.</param>
        /// <param name="page">The page of forum message list.</param>
        /// <returns>Forum theme with message list.</returns>
        [AllowAnonymous, HttpGet("{id:int}/{page:int}")]
        public async Task<IActionResult> GetTheme(int id, int page)
        {
            var model = await _forumThemeService.GetAsync(id, page);
            return Ok(model);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize, HttpGet("{id:int}")]
        public async Task<IActionResult> GetTheme(int id)
        {
            var model = await _forumThemeService.GetAsync(id);
            return Ok(model);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize, HttpPost("")]
        public async Task<IActionResult> Create([FromBody]ForumThemeDto dto)
        {
            dto.AuthorId = User.GetUserId();
            var model = await _forumThemeService.CreateAsync(dto);

            return Ok(model);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        [Authorize, HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody]ForumThemeDto dto)
        {
            // if (id != dto.Id)
            {
                //    return BadRequest();
            }
            var model = await _forumThemeService.UpdateAsync(dto);
            return Ok(model);
        }
    }
}
