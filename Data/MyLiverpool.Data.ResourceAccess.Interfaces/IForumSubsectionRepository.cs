﻿using System.Threading.Tasks;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Data.ResourceAccess.Interfaces
{
    public interface IForumSubsectionRepository: ICrudRepository<ForumSubsection>
    {
        Task<ForumSubsection> GetByIdWithThemesAsync(int subsectionId, int page);
    }
}
