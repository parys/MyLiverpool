using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;

namespace MyLiverpool.Web.Mvc.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Manages matches.
    /// </summary>
    [Route("[controller]")]
    public class MatchesController : Controller
    {
        private readonly IMatchService _matchService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="matchService"></param>
        public MatchesController(IMatchService matchService)
        {
            _matchService = matchService;
        }

        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Shows detail match page.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Detail(int id)
        {
            var match = await _matchService.GetByIdAsync(id); //todo add caching for match
            if (match == null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View(match);
        }
    }
}