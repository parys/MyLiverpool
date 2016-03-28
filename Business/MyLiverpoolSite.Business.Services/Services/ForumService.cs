﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using MyLiverpool.Business.DTO;
using MyLiverpoolSite.Business.Contracts;
using MyLiverpoolSite.Business.ViewModels.Forum;
using MyLiverpoolSite.Data.DataAccessLayer;
using MyLiverpoolSite.Data.Entities;

namespace MyLiverpoolSite.Business.Services.Services
{
    public class ForumService : IForumService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ForumService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ForumVM> Get()
        {
            var sections = await _unitOfWork.ForumSectionRepository.GetAsync(includeProperties: x => x.Subsections);
            var model = new ForumVM()
            {
                Sections = sections
            };
            return model;
        }

        public async Task<ForumSubsectionVM> GetSubsection(int subsectionId, int page = 1)
        {
            var subsection = await _unitOfWork.ForumSubsectionRepository.GetByIdAsync(subsectionId); 
            var subsectionThemes =
                await _unitOfWork.ForumThemeRepository.GetAsync(page, filter: x => x.SubsectionId == subsectionId);
            var subsectionThemesCount = await _unitOfWork.ForumThemeRepository.GetCountAsync(x => x.SubsectionId == subsectionId);
            if (subsection == null)
            {
                return new ForumSubsectionVM();
            }
            var model = _mapper.Map<ForumSubsectionVM>(subsection);
            model.Themes = new PageableData<ForumThemeVM>(_mapper.Map<IEnumerable<ForumThemeVM>>(subsectionThemes), page, subsectionThemesCount);
            return model;
        }

        public async Task<ForumThemeVM> GetTheme(int themeId, int page = 1)
        {
            var theme = await _unitOfWork.ForumThemeRepository.GetByIdAsync(themeId);
            var themeMessages = await _unitOfWork.ForumMessageRepository.GetOrderedByIdAsync(page, filter: x => x.ThemeId == themeId);
            var themeMessagesCount = await _unitOfWork.ForumMessageRepository.GetCountAsync(x => x.ThemeId == themeId);
            if (theme == null)
            {
                return new ForumThemeVM();
            }
            var model = _mapper.Map<ForumThemeVM>(theme);
            model.Messages = new PageableData<ForumMessageVM>(_mapper.Map<IEnumerable<ForumMessageVM>>(themeMessages), page, themeMessagesCount);
            return model;
        }

        public async Task<int> AddComment(string comment, int themeId, int userId)
        {
            var message = new ForumMessage()
            {
                AdditionTime = DateTime.Now,
                LastModifiedTime = DateTime.Now,
                AuthorId = userId,
                Message = comment,
                ThemeId = themeId
            };

            _unitOfWork.ForumMessageRepository.Add(message);
            await _unitOfWork.SaveAsync();

            return message.Id;
        }

        #region Dto

        public async Task<ForumSectionDto> CreateSectionAsync(string name)
        {
            var model = new ForumSection(name);
            _unitOfWork.ForumSectionRepository.Add(model);
            await _unitOfWork.SaveAsync();
            var result = Mapper.Map<ForumSectionDto>(model);
            return result;
        }

        public async Task<ForumDto> GetDtoAsync()
        {
            var sections = await _unitOfWork.ForumSectionRepository.GetAsync(includeProperties: x => x.Subsections);

            var model = new ForumDto()
            {
                Sections = _mapper.Map<ICollection<ForumSectionDto>>(sections)
            };
            return model;
        }

        public async Task<ForumSubsectionDto> GetSubsectionDtoAsync(int subsectionId, int page)
        {
            var subsection = await _unitOfWork.ForumSubsectionRepository.GetByIdAsync(subsectionId);
            var subsectionThemes =
                await _unitOfWork.ForumThemeRepository.GetAsync(page, filter: x => x.SubsectionId == subsectionId);
            var subsectionThemesCount = await _unitOfWork.ForumThemeRepository.GetCountAsync(x => x.SubsectionId == subsectionId);
            if (subsection == null)
            {
                return null;
            }
            var model = _mapper.Map<ForumSubsectionDto>(subsection);
            model.Themes = new PageableData<ForumThemeMiniDto>(_mapper.Map<IEnumerable<ForumThemeMiniDto>>(subsectionThemes), page, subsectionThemesCount);
            return model;
        }

        public async Task<ForumThemeDto> GetThemeDtoAsync(int id, int page)
        {
            var theme = await _unitOfWork.ForumThemeRepository.GetByIdAsync(id);
            var themeMessages = await _unitOfWork.ForumMessageRepository.GetOrderedByIdAsync(page, filter: x => x.ThemeId == id);
            var themeMessagesCount = await _unitOfWork.ForumMessageRepository.GetCountAsync(x => x.ThemeId == id);
            if (theme == null)
            {
                return null;
            }
            var model = _mapper.Map<ForumThemeDto>(theme);
            model.Messages = new PageableData<ForumMessageDto>(_mapper.Map<IEnumerable<ForumMessageDto>>(themeMessages), page, themeMessagesCount);
            return model;
        }

        #endregion
    }
}
