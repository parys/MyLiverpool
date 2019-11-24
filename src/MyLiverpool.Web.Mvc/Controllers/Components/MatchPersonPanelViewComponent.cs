using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Application.Matches;

namespace MyLiverpool.Web.Mvc.Controllers.Components
{
    public class MatchPersonPanelViewComponent : ViewComponent
    {
        private readonly IMediator _mediator;

        public MatchPersonPanelViewComponent(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<IViewComponentResult> InvokeAsync(int matchId, bool isHome)
        {
            var list = await _mediator.Send(new GetMatchPersonListQuery.Request {MatchId = matchId});
            return View(list.Results);
        }
    }
}
