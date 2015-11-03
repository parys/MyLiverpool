﻿using System.Threading.Tasks;

namespace MyLiverpoolSite.Business.Contracts
{
    public interface IAccountService
    {
        Task<int> GetUserIdByLoginAndPassword(string login, string password);

      //  HttpCookie GetCookie(int userId, bool rememberMe);
    }
}
