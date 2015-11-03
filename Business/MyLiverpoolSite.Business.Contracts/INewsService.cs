﻿using System.Collections.Generic;
using System.Threading.Tasks;
using MyLiverpoolSite.Business.ViewModels.News;
using MyLiverpoolSite.Data.Entities;

namespace MyLiverpoolSite.Business.Contracts
{
    public interface INewsService
    {
        /// <summary>
        /// Returns newsItem by id.
        /// </summary>
        /// <param name="id">newsItem id</param>
        /// <returns>Found newsItem or null.</returns>
        Task<IndexNewsViewModel> GetById(int id);

        Task<int> Create(CreateEditNewsViewModel model, int userId);

        int Edit(NewsItem newsItem);

        void Delete(NewsItem newsItem);

        void Delete(int id);

        Task<CreateEditNewsViewModel> GetCreateEditViewModel(int? id);

        Task<IEnumerable<IndexNewsViewModel>> GetAll();
    }
}
