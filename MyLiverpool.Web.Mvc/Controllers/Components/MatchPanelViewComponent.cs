using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Common.Web;
using MyLfc.Common.Web.DistributedCache;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.Mvc.Controllers.Components
{
    public class MatchPanelViewComponent : ViewComponent
    {
        private readonly IMatchService _matchService;
        private readonly IHelperService _helperService;
        private readonly IDistributedCacheManager _cacheManager;

        public MatchPanelViewComponent(IMatchService matchService, IDistributedCacheManager cache, IHelperService helperService)
        {
            _matchService = matchService;
            _cacheManager = cache;
            _helperService = helperService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var helpEntity = await _cacheManager.GetOrCreateAsync(CacheKeysConstants.HeaderMatchId,
                async () => await _helperService.GetValueAsync(HelperEntityType.HeaderMatch));
            if (!string.IsNullOrWhiteSpace(helpEntity))
            {
                var result = await _matchService.GetByIdAsync(int.Parse(helpEntity));
                return View(result);
            }
            return View(null as MatchDto);
        }
    }
}
