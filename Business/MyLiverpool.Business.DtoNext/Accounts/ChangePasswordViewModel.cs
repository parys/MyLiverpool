using System.ComponentModel.DataAnnotations;

namespace MyLiverpool.Business.Dto.Accounts
{
    public class ChangePasswordViewModel : IDto
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Текущий пароль")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "{0} должен быть не короче {2} и не длиннее {1}.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Новый пароль")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Повторение нового пароля")]
        [Compare("NewPassword", ErrorMessage = "Новые пароли должны совпадать.")]
        public string ConfirmPassword { get; set; }
    }
}
