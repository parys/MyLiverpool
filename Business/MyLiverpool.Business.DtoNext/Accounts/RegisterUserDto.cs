using System;
using System.ComponentModel.DataAnnotations;

namespace MyLiverpool.Business.Dto
{
    public class RegisterUserDto : IDto
    {
        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [EmailAddress]
     //   [UniqueEmail]
        [Display(Name = "Электронная почта")] 
      //  [Display(ResourceType = typeof(UsersMessages), Name = "Email")] 
        public string Email { get; set; }

        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [StringLength(100)]//, ErrorMessageResourceType = typeof(ErrorMessages), ErrorMessageResourceName = "MinimumLength", MinimumLength = 6)]
        [DataType(DataType.Password, ErrorMessage = "")]
        [Display(Name = "Пароль")]
        //   [Display(ResourceType = typeof(UsersMessages), Name = "Password")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        //   [Display(ResourceType = typeof(UsersMessages), Name = "PasswordConfirmation")]
        [Compare("Password")]//, ErrorMessageResourceType = typeof(ErrorMessages), ErrorMessageResourceName = "PasswordsNotMatch")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        //   [UniqueUserName]
        [MinLength(3)]
        [MaxLength(30)]
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
