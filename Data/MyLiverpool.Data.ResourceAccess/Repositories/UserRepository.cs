using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Data.ResourceAccess.Repositories
{
    public class UserRepository: IUserRepository
    {
        private readonly LiverpoolContext _context;
        private readonly UserManager<User> _userManager;

        public UserRepository(LiverpoolContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<User> GetByIdForUpdateAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> GetByIdAsync(int id)
        {
            var user = await _context.Users.Where(x => x.Id == id).Select(x => new User
            {
                Id = x.Id,
                OldId = x.OldId,
                Birthday = x.Birthday,
                BlogsCount = x.Materials.Count(y => y.Type == MaterialType.Blogs),
                NewsCount = x.Materials.Count(y => y.Type == MaterialType.News),
                CommentsCount = x.Comments.Count(y => y.AuthorId == x.Id),
                ConcurrencyStamp = x.ConcurrencyStamp,
                Email = x.Email,
                EmailConfirmed = x.EmailConfirmed,
                FullName = x.FullName,
                Gender = x.Gender,
                Ip = x.Ip,
                LastModified = x.LastModified,
                LockoutEnd = x.LockoutEnd,
                LockoutEnabled = x.LockoutEnabled,
                Photo = x.Photo,
                RegistrationDate = x.RegistrationDate,
                RoleGroupId = x.RoleGroupId,
                RoleGroup = x.RoleGroup,
                UserName = x.UserName,
                AccessFailedCount = x.AccessFailedCount,
                PasswordHash = x.PasswordHash,
                SecurityStamp = x.SecurityStamp,
                NormalizedEmail = x.NormalizedEmail,
                NormalizedUserName = x.NormalizedUserName
            }).FirstOrDefaultAsync();
            return user;
        }

        public async Task<string> GetUsernameAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user.UserName;
        }

        public async Task<IEnumerable<User>> GetListAsync(int page, int itemPerPage = 15, Expression<Func<User, bool>> filter = null, SortOrder order = SortOrder.Ascending,
            Expression<Func<User, object>> orderBy = null){
            
            return await GetQuerableList(page, itemPerPage, filter, order, orderBy).ToListAsync();
        }

        public IQueryable<User> GetQuerableList(int? page, int itemPerPage = 15, Expression<Func<User, bool>> filter = null,
            SortOrder order = SortOrder.Ascending, Expression<Func<User, object>> orderBy = null)
        {
            IQueryable<User> query = _context.Users.Include(x => x.RoleGroup);

            if (filter != null)
            {
                query = query.Where(filter);
            }
            if (orderBy != null)
            {
                query = query.ObjectSort(orderBy, order);
            }

            if (page.HasValue)
            {
                query = query.Skip((page.Value - 1) * itemPerPage).Take(itemPerPage);
            }

            return query;
        }

        public IQueryable<User> GetQuerableList(int page, int itemPerPage = 15, Expression<Func<User, bool>> filter = null,
            SortOrder order = SortOrder.Ascending, string orderBy = null)
        {
            IQueryable<User> query = _context.Users.Include(x => x.RoleGroup);

            if (filter != null)
            {
                query = query.Where(filter);
            }
            if (orderBy != null)
            {
                var prop = typeof(User).GetProperty(orderBy, BindingFlags.IgnoreCase);
                query = order == SortOrder.Ascending
                    ? query.OrderBy(x => prop.GetValue(x, null)) 
                    : query.OrderByDescending(x => prop.GetValue(x, null));
            }
            query = query.Skip((page - 1) * itemPerPage).Take(itemPerPage);
            return query;
        }

        public async Task UpdateAsync(User user)
        {
          //  await _userManager.UpdateAsync(user);todo do
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<IdentityResult> SetLockoutEndDateAsync(User user, DateTimeOffset? dateTimeOffset)
        {
            return await _userManager.SetLockoutEndDateAsync(user, dateTimeOffset);
        }

        public async Task<DateTimeOffset?> GetLockoutEndDateAsync(int userId)
        {
            return await _userManager.GetLockoutEndDateAsync(new User(userId));
        }

        public async Task<IdentityResult> RemoveFromRolesAsync(User user, IEnumerable<string> roles)
        {
            return await _userManager.RemoveFromRolesAsync(user, roles);
        }

        public async Task<IdentityResult> AddToRoleAsync(User user, string role)
        {
            return await _userManager.AddToRoleAsync(user, role);
        }

        public async Task<IdentityResult> AddToRolesAsync(User user, IEnumerable<string> roles)
        {
            return await _userManager.AddToRolesAsync(user, roles);
        }

        public async Task<User> FindByNameAsync(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        public async Task<User> FindByEmailAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<bool> CheckPasswordAsync(User user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }

        public async Task<IList<string>> GetRolesAsync(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return new List<string>();
            }
            return await _userManager.GetRolesAsync(user);
        }

        public async Task<IdentityResult> ChangePasswordAsync(int userId, string oldPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new NullReferenceException("User cannot be null");
            }
            return await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
        }

        public async Task<IdentityResult> ConfirmEmailAsync(int userId, string code)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError() { Description = "User is null"});
            }
            return await _userManager.ConfirmEmailAsync(user, code);
        }

        public async Task<IdentityResult> ResetPasswordAsync(User user, string token, string password)
        {
            return await _userManager.ResetPasswordAsync(user, token, password);
        }

        public async Task<string> GenerateEmailConfirmationTokenAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new NullReferenceException("User cannot be null");
            }
            return await _userManager.GenerateEmailConfirmationTokenAsync(user);
        }

        public async Task<string> GeneratePasswordResetTokenAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new NullReferenceException("User cannot be null");
            }
            return await _userManager.GeneratePasswordResetTokenAsync(user);
        }

        public async Task<IdentityResult> CreateAsync(User user, string password)
        {
            return await _userManager.CreateAsync(user, password);
        }

        public async Task<User> AddAsync(User entity)
        {
            var result =  await _userManager.CreateAsync(entity); //for migrator
            return result.Succeeded ? entity : null;
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(User entity)
        {
            throw new NotImplementedException();
        }

        public async void Update(User entity)
        {
            await _userManager.UpdateAsync(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<int> GetCountAsync(Expression<Func<User, bool>> filter = null)
        {
            IQueryable<User> query = _context.Users;
            if (filter != null)
            {
                query = query.Where(filter);
            }
            return await query.CountAsync();
        }

        public Task<IEnumerable<User>> GetListAsync()
        {
            throw new NotImplementedException("Not need to implement");
        }

        public async Task<User> GetByIdFromManagerAsync(int userId)
        {
            return await _userManager.FindByIdAsync(userId.ToString());
        }

        public async Task<UserConfig> GetUserConfigAsync(int userId)
        {
            return await _context.UserConfigs.FindAsync(userId);
        }

        public async Task<UserConfig> CreateOrUpdateUserConfigAsync(UserConfig config)
        {
            var configEntity = await _context.UserConfigs.FindAsync(config.UserId);
            if (configEntity != null)
            {
                _context.UserConfigs.Update(config);
            }
            else
            {
                await _context.UserConfigs.AddAsync(config);
            }
            await SaveChangesAsync();
            return config;
        }
    }
}
