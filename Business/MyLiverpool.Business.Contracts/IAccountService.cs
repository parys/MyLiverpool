using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Accounts;

namespace MyLiverpool.Business.Contracts
{
    public interface IAccountService
    {
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordViewModel viewModel);

        Task<bool> ConfirmEmailAsync(int userId, string code);

        Task<bool> ForgotPasswordAsync(string email);

        Task<bool> IsUserNameUniqueAsync(string userName);

        Task<bool> IsEmailUniqueAsync(string email);

        Task<DateTime> GetLockOutEndDateAsync(int userId);

        Task<IdentityResult> RegisterUserAsync(RegisterUserDto model);

        Task<bool> ResendConfirmEmail(string email);

        Task<IdentityResult> ResetPasswordAsync(ResetPasswordDto dto);

        Task<bool> UpdateLastModifiedAsync(int userId);
    }
}
