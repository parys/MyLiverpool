using AutoMapper;
using Microsoft.AspNetCore.Identity;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Business.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IGenericRepository<RoleGroup> _roleGroupRepository;
        private readonly IMapper _mapper;
        private readonly string _defaultPhotoPath = Path.Combine("content", "avatars", "default.png");

        public UserService(IMapper mapper, IUserRepository userRepository, IGenericRepository<RoleGroup> roleGroupRepository)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _roleGroupRepository = roleGroupRepository;
        }

        public async Task<bool> BanUser(int userId, int banDayCount)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            var result = await _userRepository.SetLockoutEndDateAsync(user, new DateTimeOffset(DateTime.Now.AddDays(banDayCount)));
            return result == IdentityResult.Success;
        }

        public async Task<bool> UnbanUser(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            var result = await _userRepository.SetLockoutEndDateAsync(user, new DateTimeOffset?());
            return result == IdentityResult.Success;
        }

        public async Task<UserDto> GetUserProfileDtoAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            var dto = _mapper.Map<UserDto>(user);
            return dto;
        }

        public async Task<PageableData<UserMiniDto>> GetUsersDtoAsync(UserFiltersDto dto)
        {
            Expression<Func<User, bool>> filter = x => true;
            if (dto.RoleGroupId.HasValue)
            {
                filter = filter.And(x => x.RoleGroupId == dto.RoleGroupId.Value);
            }
            if (!string.IsNullOrWhiteSpace(dto.UserName))
            {
                filter = filter.And(x => x.UserName.Contains(dto.UserName));
            }
            if (!string.IsNullOrWhiteSpace(dto.Ip))
            {
                filter = filter.And(x => x.Ip.Contains(dto.Ip));
            }
            Expression<Func<User, object>> sortBy = x => x.LastModified;
            if (!string.IsNullOrWhiteSpace(dto.SortBy))
            {
                if (dto.SortBy.Contains(nameof(UserMiniDto.RoleGroupName), StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.RoleGroup.RussianName;
                }
                if (dto.SortBy.Contains(nameof(UserMiniDto.RegistrationDate), StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.RegistrationDate;
                }
                else if (dto.SortBy.Contains(nameof(UserMiniDto.CommentsCount),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.Comments.Count;
                }
                else if (dto.SortBy.Contains(nameof(UserMiniDto.UserName),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.UserName;
                }
            }

            var usersDto = await _userRepository.GetQuerableList(dto.Page, dto.ItemsPerPage, filter, dto.SortOrder, sortBy)
                .Select(x => new UserMiniDto
                {
                    Id = x.Id,
                    EmailConfirmed = x.EmailConfirmed,
                    LastModified = x.LastModified,
                    RegistrationDate = x.RegistrationDate,
                    CommentsCount = x.Comments.Count,
                    RoleGroupName = x.RoleGroup.RussianName,
                    Photo = x.Photo,
                    UserName = x.UserName
                }).ToListAsync();
            var allUsersCount = await _userRepository.GetCountAsync(filter);
            var result = new PageableData<UserMiniDto>(usersDto, dto.Page, allUsersCount, dto.ItemsPerPage);
            return result;
        }

        public async Task<string> GetPhotoPathAsync(int userId)
        {
            var user = await _userRepository.GetByIdFromManagerAsync(userId);
            return user.Photo;
        }

        public async Task<bool> UpdatePhotoPathAsync(int userId, string photo)
        {
            var user = await _userRepository.GetByIdFromManagerAsync(userId);
            user.Photo = photo;
            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<User> FindAsync(string userName, string password)
        {
            var user = await _userRepository.FindByNameAsync(userName);
            if (await _userRepository.CheckPasswordAsync(user, password))
            {
                return user;
            }
            return null;
        }

        public async Task<UserDto> UpdateAsync(UserDto user)
        {
            var model = await _userRepository.GetByIdForUpdateAsync(user.Id);
            if (model != null)
            {
                model.Birthday = user.Birthday;
                model.FullName = user.FullName;
                model.Gender = user.Gender;
                await _userRepository.UpdateAsync(model);
            }
            return _mapper.Map<UserDto>(model);
        }

        public async Task<IList<string>> GetRolesAsync(int id)
        {
            var result = await _userRepository.GetRolesAsync(id);
            return result;
        }

        public async Task<UserDto> GetUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<string> GetUsernameAsync(int id)
        {
            return await _userRepository.GetUsernameAsync(id);
        }

        public async Task<string> ResetAvatarAsync(int userId)
        {
            var user = await _userRepository.GetByIdFromManagerAsync(userId);
            if (user == null)
            {
                throw new NullReferenceException("User can't be null");
            }
            if (FileHelper.Delete(user.Photo))
            {
                user.Photo = _defaultPhotoPath;
                await _userRepository.UpdateAsync(user);
            }
            return user.Photo;
        }

        public async Task UpdateUserIpAddress(string ipAddress, int userId)
        {
            var user = await _userRepository.GetByIdFromManagerAsync(userId);
            if (user != null)
            {
                user.LastModified = DateTime.Now;
                user.Ip = ipAddress;
                await _userRepository.UpdateAsync(user);
            }
        }

        public async Task<UserConfigDto> GetUserConfigAsync(int userId)
        {
            var model = await _userRepository.GetUserConfigAsync(userId) ?? new UserConfig();
            return _mapper.Map<UserConfigDto>(model);
        }

        public async Task<UserConfigDto> UpdateUserConfigAsync(UserConfigDto config, int currentUserId)
        {
            var model = _mapper.Map<UserConfig>(config);
            model.UserId = currentUserId;
            var result = await _userRepository.CreateOrUpdateUserConfigAsync(model);
            return _mapper.Map<UserConfigDto>(result);
        }

        public async Task<IEnumerable<UserMiniDto>> GetBirthdaysAsync()
        {
            Expression<Func<User, bool>> filter = x => x.Birthday.HasValue &&
                                                       x.Birthday.Value.Date.Day == DateTimeOffset.Now.Date.Day &&
                                                       x.Birthday.Value.Date.Month == DateTimeOffset.Now.Date.Month &&
                                                       x.LastModified.AddMonths(1).Date > DateTimeOffset.Now.Date;
            var list = await _userRepository.GetListAsync(1, 1000, filter, SortOrder.Descending, u => u.LastModified);
            return _mapper.Map<IEnumerable<UserMiniDto>>(list);
        }
    }
}
