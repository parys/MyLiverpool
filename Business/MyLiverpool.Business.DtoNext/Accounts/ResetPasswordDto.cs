using System.ComponentModel.DataAnnotations;

namespace MyLiverpool.Business.Dto
{
    public class ResetPasswordDto : IDto
    {
        [Required(AllowEmptyStrings = false)]
        public string Code { get; set; }

        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [EmailAddress(ErrorMessage = "Введенное значение не является допустимым адресом электронной почты.")]
        [Display(Name = "Электронная почта")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [StringLength(100, ErrorMessage = "Значение не должно превышать 100 символов.")]
        [DataType(DataType.Password, ErrorMessage = "")]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        [Compare("Password", ErrorMessage = "Пароли должны совпадать.")]
        public string ConfirmPassword { get; set; }
    }
}
