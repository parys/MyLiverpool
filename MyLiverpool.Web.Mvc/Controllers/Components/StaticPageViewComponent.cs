using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Common.Web;
using MyLfc.Common.Web.DistributedCache;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.Mvc.Controllers.Components
{
    public class StaticPageViewComponent : ViewComponent
    {
        private readonly IHelperService _helperService;
        private readonly IDistributedCacheManager _cacheManager;

        public StaticPageViewComponent(IHelperService helperService, IDistributedCacheManager cache)
        {
            _helperService = helperService;
            _cacheManager = cache;
        }

        public async Task<IViewComponentResult> InvokeAsync(HelperEntityType type)
        {
            var result = await _cacheManager.GetOrCreateStringAsync(GlobalConstants.HelperEntity + (int)type, 
                async () => await _helperService.GetValueAsync(type));
            return View(model:result);
        }
    }
}
