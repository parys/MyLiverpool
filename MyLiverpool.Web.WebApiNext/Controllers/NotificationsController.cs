using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Common.Utilities.Extensions;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <inheritdoc />
    /// <summary>
    /// Manages notifications.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class NotificationsController : Controller
    {
        private readonly INotificationService _notificationService;
        
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="notificationService"></param>
        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>
        /// Returns user notifications.
        /// </summary>
        /// <returns></returns>
        [Authorize, HttpGet("")]
        public async Task<IActionResult> GetListAsync()
        {
            var model = await _notificationService.GetListAsync(User.GetUserId());
            return Json(model);
        }

        /// <summary>
        /// Mark notifications as read.
        /// </summary>
        /// <param name="ids">Array with ids for </param>
        /// <returns></returns>
        [Authorize, HttpPut("read")]
        public async Task<IActionResult> ReadAsync([FromBody]int[] ids)
        {
            var userId = User.GetUserId();
            var model = await _notificationService.MarkAsReadAsync(ids, userId);
            return Json(model);
        }
        
        /// <summary>
        /// Returns count of unread notifications.
        /// </summary>
        /// <returns>Count of unread notifications.</returns>
        [Authorize, HttpGet("unread")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = User.GetUserId();
            var result = //await _cache.GetOrCreate(CacheKeysConstants.NotificationUserId + userId, async x =>
                await _notificationService.GetUnreadCountAsync(userId);//);
            return Json(result);
        }
    }
}
