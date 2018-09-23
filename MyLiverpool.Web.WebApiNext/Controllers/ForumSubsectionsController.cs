using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages forum subsections.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class ForumSubsectionsController : Controller
    {
        private readonly IForumSubsectionService _forumSubsectionService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="forumSubsectionService"></param>
        public ForumSubsectionsController(IForumSubsectionService forumSubsectionService)
        {
            _forumSubsectionService = forumSubsectionService;
        }

        /// <summary>
        /// Get subsection with themes at 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [AllowAnonymous, HttpGet("{id:int}/{page:int}")]
        public async Task<IActionResult> GetSubsection(int id, int page)
        {
            var model = await _forumSubsectionService.GetAsync(id, page);
            return Ok(model);
        }

        /// <summary>
        /// Get subsection without themes.
        /// </summary>
        /// <param name="id">The identifier of subsection.</param>
        /// <returns>Found subsection.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetSubsection(int id)
        {
            var model = await _forumSubsectionService.GetAsync(id);
            return Ok(model);
        }

        /// <summary>
        /// Creates new forum subsesction.
        /// </summary>
        /// <param name="dto">Entity with filled fiels.</param>
        /// <returns>Created entity.</returns>
        [Authorize, HttpPost("")]
        public async Task<IActionResult> Create([FromBody] ForumSubsectionDto dto)
        {
            var model = await _forumSubsectionService.CreateAsync(dto);
            return Ok(model);
        }

        /// <summary>
        /// Updates subsection with dto entity.
        /// </summary>
        /// <param name="id">The identifier of updating entity.</param>
        /// <param name="dto">Updating model entity.</param>
        /// <returns>Updated entity.</returns>
        [Authorize, HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ForumSubsectionDto dto)
        {
            if (id != dto.Id || !ModelState.IsValid)
            {
                return BadRequest();
            }
            var model = await _forumSubsectionService.UpdateAsync(dto);
            return Ok(model);
        }

        /// <summary>
        /// Returns forum subsections.
        /// </summary>
        /// <returns>Forum subsection list.</returns>
        [AllowAnonymous, HttpGet]
        public async Task<IActionResult> GetListAsync()
        {
            var model = await _forumSubsectionService.GetListAsync();
            return Ok(model);
        }
    }
}
