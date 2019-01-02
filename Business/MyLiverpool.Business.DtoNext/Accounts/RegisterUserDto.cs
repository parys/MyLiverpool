using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace MyLiverpool.Business.Dto
{
    public class RegisterUserDto : IDto
    {
        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [EmailAddress(ErrorMessage = "Введенное значение не является допустимым адресом электронной почты.")]
        [Remote("IsEmailUnique", "Account", HttpMethod = "POST", ErrorMessage = "Пользователь с таким адресом почты уже существует. Пожалуйста, введите другой адрес. Или напишите на andrew_parys@tut.by")]
        [Display(Name = "Электронная почта")] 
      //  [Display(ResourceType = typeof(UsersMessages), Name = "Email")] 
        public string Email { get; set; }

        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [StringLength(100, ErrorMessage = "Значение не должно превышать 100 символов.")]
        [DataType(DataType.Password, ErrorMessage = "")]
        [Display(Name = "Пароль")]
        //   [Display(ResourceType = typeof(UsersMessages), Name = "Password")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        [Compare("Password", ErrorMessage = "Пароли должны совпадать.")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [Remote("IsUserNameUnique", "Account", HttpMethod = "POST", ErrorMessage = "Пользователь с таким именем уже существует. Пожалуйста, выберите другое имя.")]
        [MinLength(3, ErrorMessage = "Значение должно превышать 3 символа.")]
        [MaxLength(30, ErrorMessage = "Значение не должно превышать 30 символов.")]
        [Display(Name = "Логин")]
        //  [Display(ResourceType = typeof(UsersMessages), Name = "UserName")]
        public string UserName { get; set; }

  //      [Display(ResourceType = typeof(UsersMessages), Name = "FullName")]
        public string FullName { get; set; }

      //  [Required]//(ErrorMessageResourceType = typeof(ErrorMessages), ErrorMessageResourceName = "Required")]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
      //  [Display(ResourceType = typeof(UsersMessages), Name = "BirthDay")]
        public DateTimeOffset Birthday { get; set; }
    }
}
