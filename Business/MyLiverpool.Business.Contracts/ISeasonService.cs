using System.Collections.Generic;
using System.Threading.Tasks;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Business.Contracts
{
    public interface ISeasonService : IEntityService<SeasonDto>
    {
        Task<ICollection<SeasonDto>> GetListAsync();

        Task<PageableData<SeasonDto>> GetListAsync(SeasonFiltersDto filters);

        Task<SeasonDto> GetByIdWithMatchesAsync(int id);

        Task<IEnumerable<KeyValuePair<int, string>>> GetSeasonsByYearAsync(string typed);

        Task<int> GetCurrentSeasonIdAsync();

        Task SetCurrentSeasonAsync(int currentSeasonId);
    }
}
