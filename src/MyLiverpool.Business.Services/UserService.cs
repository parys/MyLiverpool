﻿using AutoMapper;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.ResourceAccess.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;
using MyLfc.Domain;

namespace MyLiverpool.Business.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly string _defaultPhotoPath = Path.Combine("content", "avatars", "default.png");

        public UserService(IMapper mapper, IUserRepository userRepository)
        {
            _mapper = mapper;
            _userRepository = userRepository;
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
    }
}
