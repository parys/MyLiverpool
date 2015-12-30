﻿using System.Threading.Tasks;
using MyLiverpool.Business.DTO;
using MyLiverpoolSite.Business.ViewModels.Forum;

namespace MyLiverpoolSite.Business.Contracts
{
    public interface IForumService
    {
        Task<ForumVM> Get();

        Task<ForumSubsectionVM> GetSubsection(int subsectionId, int page = 1);

        Task<ForumThemeVM> GetTheme(int themeId, int page = 1);

        Task<int> AddComment(string comment, int themeId, int userId);

        Task<ForumDto> GetDtoAsync();

        Task<ForumSubsectionDto> GetSubsectionDtoAsync(int subsectionId, int page);
    }
}
