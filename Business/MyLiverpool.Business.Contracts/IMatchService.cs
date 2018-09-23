using System.Collections.Generic;
using System.Threading.Tasks;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Business.Contracts
{
    public interface IMatchService : IEntityService<MatchDto>
    {
        Task<PageableData<MatchDto>> GetListAsync(int page, int itemsPerPage = 15, int? seasonId = null);
        Task<PageableData<MatchDto>> GetListAsync(MatchFiltersDto filters);

        Task<IEnumerable<MatchDto>> GetListForSeasonAsync(int seasonId);
        
        Task<IEnumerable<MatchDto>> GetForCalendarAsync();
    }
}
