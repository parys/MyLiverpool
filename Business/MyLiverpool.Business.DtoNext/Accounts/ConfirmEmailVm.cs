using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace MyLiverpool.Business.Dto
{
    public class ConfirmEmailVm
    {
        [Required(ErrorMessage = "Поле обязательно к заполнению.")]
        [EmailAddress(ErrorMessage = "Введенное значение не является допустимым адресом электронной почты.")]
        [Display(Name = "Электронная почта")]
        public string Email { get; set; }
    }
}
