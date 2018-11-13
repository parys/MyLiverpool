using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto.Polls;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages polls.
    /// </summary>
 //   [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme, Roles = nameof(RolesEnum.NewsStart)), Route("api/v1/[controller]")]
    [AllowAnonymous, Route("api/v1/[controller]")]
    public class PollsController : Controller
    {
        private readonly IPollService _pollService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="pollService"></param>
        public PollsController(IPollService pollService)
        {
            _pollService = pollService;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous, HttpGet("")]
        public async Task<JsonResult> GetListAsync()
        {
            var result = await _pollService.GetListAsync();
            return Json(result);
        }

        /// <summary>
        /// Returns poll by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<JsonResult> GetAsync(int id)
        {
            var result = await _pollService.GetByIdAsync(id);
            return Json(result);
        }

        /// <summary>
        /// Creates new poll.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
      //  [Authorize(), HttpPost("")]
        [HttpPost("")]
        public async Task<JsonResult> CreateAsync([FromBody] PollDto dto)
        {
            var result = await _pollService.CreateAsync(dto);
            return Json(result);
        }

        /// <summary>
        /// Updates poll.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] PollDto dto)
        {
            if (id != dto.Id || !ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _pollService.UpdateAsync(dto);
            return Json(result);
        }
    }
}
