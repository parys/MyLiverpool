using System.Threading.Tasks;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Business.Contracts
{
    public interface IWishService
    {
        Task<WishDto> CreateAsync(WishDto dto);

        Task<PageableData<WishDto>> GetListAsync(int page, int? typeId = null, string filterText = null);

        Task<PageableData<WishDto>> GetListAsync(WishFiltersDto filters);

        Task<WishDto> GetAsync(int wishId);

        Task<bool> DeleteAsync(int id);

        Task<WishDto> UpdateAsync(WishDto dto);
    }
}