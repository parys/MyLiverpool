﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using MyLfc.Domain;

namespace MyLiverpool.Data.ResourceAccess.Interfaces
{
    public interface IUserRepository : ICrudRepository<User>
    {
        Task<DateTimeOffset?> GetLockoutEndDateAsync(int userId);

        Task<User> FindByNameAsync(string username);

        Task<User> FindByEmailAsync(string email);

        Task<bool> CheckPasswordAsync(User user, string password);

        Task<IdentityResult> ChangePasswordAsync(int userId, string oldPassword, string newPassword);

        Task<IdentityResult> ConfirmEmailAsync(int userId, string code);

        Task<IdentityResult> ResetPasswordAsync(User user, string token, string password);

        Task<string> GenerateEmailConfirmationTokenAsync(int userId);

        Task<string> GeneratePasswordResetTokenAsync(int userId);

        Task<IdentityResult> CreateAsync(User user, string password);

        Task<User> GetByIdForUpdateAsync(int userId);
    }
}