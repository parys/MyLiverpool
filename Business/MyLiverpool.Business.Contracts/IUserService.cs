using System.Collections.Generic;
using System.Threading.Tasks;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Business.Contracts
{
    public interface IUserService
    {
        Task<bool> BanUser(int userId, int banDayCount);

        Task<bool> UnbanUser(int userId);
        
        Task<UserDto> GetUserProfileDtoAsync(int id);

        Task<PageableData<UserMiniDto>> GetUsersDtoAsync(UserFiltersDto dto);

        Task<string> GetPhotoPathAsync(int userId);

        Task<bool> UpdatePhotoPathAsync(int userId, string photo);

        Task<User> FindAsync(string userName, string password);

        Task<UserDto> UpdateAsync(UserDto user);

        Task<IList<string>> GetRolesAsync(int id);

        Task<UserDto> GetUserAsync(int id);

        Task<string> GetUsernameAsync(int id);

        Task<string> ResetAvatarAsync(int userId);

        Task UpdateUserIpAddress(string ipAddress, int userId);

        Task<UserConfigDto> GetUserConfigAsync(int userId);

        Task<UserConfigDto> UpdateUserConfigAsync(UserConfigDto config, int currentUserId);

        Task<IEnumerable<UserMiniDto>> GetBirthdaysAsync();
    }
}
