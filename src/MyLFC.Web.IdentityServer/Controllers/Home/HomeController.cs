using System.Threading.Tasks;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;

namespace MyLFC.Web.IdentityServer.Controllers.Home
{
    [SecurityHeaders]
    public class HomeController : Controller
    {
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IHelperService _helperService;
        private readonly IUserService _userService;

        public HomeController(IIdentityServerInteractionService interaction, IHelperService helperService, IUserService userService)
        {
            _interaction = interaction;
            _helperService = helperService;
            _userService = userService;
        }

        [Authorize]
        public async Task<IActionResult> Index()
        {
            var user = await _userService.GetUserAsync(User.GetUserId());
            return View(user);
        }

        [AllowAnonymous]
        public async Task<IActionResult> Rules()
        {
            var rules = await _helperService.GetValueAsync(HelperEntityType.Rules);
            return View(nameof(Rules), rules);
        }

        /// <summary>
        /// Shows the error page
        /// </summary>
        public async Task<IActionResult> Error(string errorId)
        {
            var vm = new ErrorViewModel();

            // retrieve error details from identityserver
            var message = await _interaction.GetErrorContextAsync(errorId);
            if (message != null)
            {
                vm.Error = message;
            }

            return View("Error", vm);
        }
    }
}