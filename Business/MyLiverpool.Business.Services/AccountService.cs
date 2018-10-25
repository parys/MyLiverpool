using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Accounts;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class AccountService : IAccountService
    {
        private readonly IMapper _mapper;
        private readonly IEmailSender _messageService;
        private readonly IHttpContextAccessor _accessor;
        private readonly IUserRepository _userRepository;
        private const string DefaultPhotoPath = "/content/avatars/default.png";

        public AccountService(IMapper mapper, IEmailSender messageService, IHttpContextAccessor accessor, IUserRepository userRepository)
        {
            _mapper = mapper;
            _messageService = messageService;
            _accessor = accessor;
            _userRepository = userRepository;
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordViewModel viewModel)
        {
            var result = await _userRepository.ChangePasswordAsync(userId, viewModel.OldPassword, viewModel.NewPassword);
            return result.Succeeded;
        }

        public async Task<bool> ConfirmEmailAsync(int userId, string code)
        {
            code = code.Base64ForUrlDecode();
            var result = await _userRepository.ConfirmEmailAsync(userId, code);
            return result.Succeeded;
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var user = await _userRepository.FindByEmailAsync(email);
            if (user == null || !user.EmailConfirmed)
            {
                return true;
            }
            await SendForgotPasswordEmailAsync(user.Email, user.Id);
            return true;
        }

        public async Task<bool> IsUserNameUniqueAsync(string userName)
        {
            var foundUser = await _userRepository.FindByNameAsync(userName);
            return foundUser == null;
        }

        public async Task<bool> IsEmailUniqueAsync(string email)
        {
            var foundUser = await _userRepository.FindByEmailAsync(email);
            return foundUser == null;
        }

        public async Task<DateTime> GetLockOutEndDateAsync(int userId)
        {
            var dateTime = await _userRepository.GetLockoutEndDateAsync(userId);
            return dateTime?.DateTime ?? DateTime.MinValue;
        }

        public async Task<IdentityResult> RegisterUserAsync(RegisterUserDto model)
        {
            var user = _mapper.Map<User>(model);
            user.RegistrationDate = DateTime.Now;
            user.LastModified = DateTime.Now;
            user.LockoutEnabled = true;
            user.RoleGroupId = 6;
            user.Photo = DefaultPhotoPath;
            user.Birthday = null;

            IdentityResult result = await _userRepository.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
               // await _userRepository.AddToRoleAsync(user, RolesEnum.Simple.ToString());

                await SendConfirmEmailAsync(user.Email, user.Id);
            }
            return result;
        }

        public async Task<bool> ResendConfirmEmail(string email)
        {
            var user = await _userRepository.FindByEmailAsync(email);
            if (user == null || user.EmailConfirmed)
            {
                return false;
            }
            await SendConfirmEmailAsync(user.Email, user.Id);
            return true;
        }

        public async Task<IdentityResult> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _userRepository.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError());
            }
            return await _userRepository.ResetPasswordAsync(user, dto.Code.Base64ForUrlDecode(), dto.Password);
        }

        public async Task<bool> UpdateLastModifiedAsync(int userId)
        {
            var user = await _userRepository.GetByIdForUpdateAsync(userId);
            user.LastModified = DateTime.Now;
            await _userRepository.UpdateAsync(user);

            return true;
        }

        #region private
        private async Task<string> GetConfirmEmailBody(int userId)
        {
            var host = _accessor.HttpContext.Request.Host;
            string code = await _userRepository.GenerateEmailConfirmationTokenAsync(userId);
            code = code.Base64ForUrlEncode();
            
            var callbackUrl = $"http://{host}/account/confirmEmail?userId={userId}&code={code}";
            return $"Пожалуйста, подтвердите ваш аккаунт, кликнув <a href=\"{callbackUrl}\">здесь</a>.";
        }

        private async Task<string> GetForgotPasswordBody(int userId)
        {
            var host = _accessor.HttpContext.Request.Host;
            string code = await _userRepository.GeneratePasswordResetTokenAsync(userId);
            code = code.Base64ForUrlEncode();

            var callbackUrl = $"http://{host}/account/resetPassword?code={code}";
            return $"Пожалуйста, сбросьте ваш пароль, кликнув <a href=\"{callbackUrl}\"> здесь </a>.";
        }

        private async Task SendConfirmEmailAsync(string email, int userId)
        {
            const string registerFinished = "Завершение регистрации";
            await _messageService.SendEmailAsync(email, registerFinished, await GetConfirmEmailBody(userId));
        }

        private async Task SendForgotPasswordEmailAsync(string email, int userId)
        {
            const string forgotPassword = "Восстановление забытого пароля";
            await _messageService.SendEmailAsync(email, forgotPassword, await GetForgotPasswordBody(userId));
        }
        #endregion
    }
}
