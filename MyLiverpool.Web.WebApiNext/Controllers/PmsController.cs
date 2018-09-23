using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Common.Web.Hubs;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Common.Utilities.Extensions;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages private messages.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class PmsController : Controller
    {
        private readonly IPmService _pmService;
        private readonly ISignalRHubAggregator _signalRHub;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="pmService"></param>
        /// <param name="signalRHub"></param>
        public PmsController(IPmService pmService, ISignalRHubAggregator signalRHub)
        {
            _pmService = pmService;
            _signalRHub = signalRHub;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [Authorize, HttpGet("")]
        public async Task<IActionResult> GetPms()
        {
            var model = await _pmService.GetListAsync(User.GetUserId());
            return Ok(model);
        }

        /// <summary>
        /// Returns detailed pm.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize, HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            var userId = User.GetUserId();
            var model = await _pmService.GetAsync(id, userId);
      //      _cache.Remove(UserPm + userId);
            return Ok(model);
        }


        /// <summary>
        /// Creates new private message.
        /// </summary>
        /// <param name="model">Private message model.</param>
        /// <returns>Is created successfully.</returns>
        [Authorize, HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody]PrivateMessageDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            model.SenderId = User.GetUserId();
            if (model.ReceiverId == model.SenderId)
            {
                return BadRequest();
            }
            var result = await _pmService.SaveAsync(model);
            if (result != null)
            {
                _signalRHub.SendToUser(HubEndpointConstants.NewPmEndpoint, result, model.ReceiverId);
            }
         //   _cache.Remove(UserPm + model.ReceiverId);
            return Ok(result);
        }

        /// <summary>
        /// Returns count of unread messages.
        /// </summary>
        /// <returns>Count of unreaded messages.</returns>
        [Authorize, HttpGet("unreadCount")]
        public async Task<IActionResult> GetUnreadPmCount()
        {
            var userId = User.GetUserId();
            var result = //await _cache.GetOrCreate(UserPm + userId, async x =>
            await _pmService.GetUnreadPmCountAsync(userId);//);
            return Json(result);
        }
    }
}
