using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Common.Web;
using MyLfc.Common.Web.DistributedCache;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Common.Utilities.Extensions;

namespace MyLiverpool.Web.Mvc.Controllers
{
    [Authorize]
    [Route("[controller]/[action]")]
    public class CommentController : Controller
    {
        private readonly ICommentService _commentService;
        private readonly IDistributedCacheManager _cacheManager;

        public CommentController(ICommentService commentService, IDistributedCacheManager cacheManager)
        {
            _commentService = commentService;
            _cacheManager = cacheManager;
        }
        
        [Authorize, HttpPost("")]
        public async Task<IActionResult> Create([FromBody] CommentDto dto)
        {
            dto.IsVerified = false;//IsSiteTeamMember();
            dto.AuthorId = User.GetUserId();
            var result = await _commentService.AddAsync(dto);

            _cacheManager.Remove(CacheKeysConstants.MaterialList);
            _cacheManager.Remove(CacheKeysConstants.LastComments);
            result.AuthorUserName = User.Identity.Name;

         //   var oldMessage = result.Message.Substring(0);
         //   SanitizeComment(result);

            if (!string.IsNullOrWhiteSpace(result.Message))
            {
      //todo          _signalRHubAggregator.Send(HubEndpointConstants.AddComment, result);
            }

         //  result.Message = oldMessage;

            return Ok(result);
        }
    }
}