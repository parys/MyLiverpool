using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Data.ResourceAccess.Interfaces
{
    public interface IUserRepository : ICrudRepository<User>
    {
        Task<string> GetUsernameAsync(int id);
        
        Task<IEnumerable<User>> GetListAsync(int page, int itemPerPage = 15,
            Expression<Func<User, bool>> filter = null,
            SortOrder order = SortOrder.Ascending, Expression<Func<User, object>> orderBy = null);

        IQueryable<User> GetQuerableList(int? page, int itemPerPage = 15,
            Expression<Func<User, bool>> filter = null,
            SortOrder order = SortOrder.Ascending, Expression<Func<User, object>> orderBy = null);

        IQueryable<User> GetQuerableList(int page, int itemPerPage = 15,
            Expression<Func<User, bool>> filter = null,
            SortOrder order = SortOrder.Ascending, string orderBy = null);

        
        Task<IdentityResult> SetLockoutEndDateAsync(User user, DateTimeOffset? dateTimeOffset);

        Task<DateTimeOffset?> GetLockoutEndDateAsync(int userId);

        Task<IdentityResult> RemoveFromRolesAsync(User user, IEnumerable<string> roles);

        Task<IdentityResult> AddToRoleAsync(User user, string role);

        Task<IdentityResult> AddToRolesAsync(User user, IEnumerable<string> roles);

        Task<User> FindByNameAsync(string username);

        Task<User> FindByEmailAsync(string email);

        Task<bool> CheckPasswordAsync(User user, string password);

        Task<IList<string>> GetRolesAsync(int id);

        Task<IdentityResult> ChangePasswordAsync(int userId, string oldPassword, string newPassword);

        Task<IdentityResult> ConfirmEmailAsync(int userId, string code);

        Task<IdentityResult> ResetPasswordAsync(User user, string token, string password);

        Task<string> GenerateEmailConfirmationTokenAsync(int userId);

        Task<string> GeneratePasswordResetTokenAsync(int userId);

        Task<IdentityResult> CreateAsync(User user, string password);

        Task<User> GetByIdFromManagerAsync(int userId);

        Task<User> GetByIdForUpdateAsync(int userId);

        Task<UserConfig> GetUserConfigAsync(int userId);

        Task<UserConfig> CreateOrUpdateUserConfigAsync(UserConfig config);
    }
}