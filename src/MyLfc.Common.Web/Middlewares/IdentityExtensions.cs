using System;
using AspNet.Security.OpenIdConnect.Primitives;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using MyLfc.Domain;
using MyLfc.Persistence;

namespace MyLfc.Common.Web.Middlewares
{
    public static class IdentityExtensions
    {
        public static IServiceCollection AddCustomIdentitySettings(this IServiceCollection services)
        {
            services.AddDefaultIdentity<User>(options =>
                {
                    options.Password.RequireDigit = false;
                    options.Password.RequiredLength = 6;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;
                    options.User.RequireUniqueEmail = true;
                    options.User.AllowedUserNameCharacters =
                        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@!#$&?абвгдеёжзийклмнопрстуфхцчшщъыьэюяAБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
                    options.SignIn.RequireConfirmedEmail = true;
                    options.SignIn.RequireConfirmedPhoneNumber = false;
                    options.Lockout.AllowedForNewUsers = true;
                    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromSeconds(10);
                })
                .AddRoles<Role>()
                .AddEntityFrameworkStores<LiverpoolContext>()
                .AddDefaultTokenProviders();

            //services.Configure<IdentityOptions>(options =>
            //{
            //    options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
            //    options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
            //    options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            //});

            return services;
        }
    }
}
