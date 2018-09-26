using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class ForumSectionService : IForumSectionService
    {
        private readonly IMapper _mapper;
        private readonly IGenericRepository<ForumSection> _forumSectionRepository;

        public ForumSectionService(IMapper mapper, IGenericRepository<ForumSection> forumSectionRepository)
        {
            _mapper = mapper;
            _forumSectionRepository = forumSectionRepository;
        }

        public async Task<ForumSectionDto> CreateAsync(string name)
        {
            var foundCount = await _forumSectionRepository.CountAsync(x => x.Name == name);
            if (foundCount > 0)
            {
                return null;
            }
            var model = new ForumSection(name);
            model = await _forumSectionRepository.CreateAsync(model);
            var result = _mapper.Map<ForumSectionDto>(model);
            return result;
        
    }

        public async Task<bool> DeleteAsync(int id)
        {
            var section = await _forumSectionRepository.GetFirstByPredicateAsync(x => x.Id == id);
            if (section.Subsections.Count > 0)
            {
                return false;
            }
            await _forumSectionRepository.DeleteAsync(section);
            return true;
        }

        public async Task<ForumSectionDto> GetAsync(int id)
        {
            var section = await _forumSectionRepository.GetFirstByPredicateAsync(x => x.Id == id);
            return _mapper.Map<ForumSectionDto>(section);
        }

        public async Task<IEnumerable<ForumSectionDto>> GetListAsync(bool isAdmin)
        {
            Expression<Func<ForumSubsection, bool>> filter = x => true;
            if (!isAdmin)
            {
                filter = s => s.Name != "MyLiverpool Shop" &&
                              s.Name != "Администрация" &&
                              s.Name != "Новости" &&
                              s.Name != "Рабочие темы";
            }
            var sections = await _forumSectionRepository
                .GetQueryableList()
                .Select(x => new ForumSection
            {
                Id = x.Id,
                Name = x.Name,
                IdOld = x.IdOld,
                Subsections = x.Subsections.Select(y => new ForumSubsection()
                {
                    Id = y.Id,
                    Name = y.Name,
                    ThemesCount = y.Themes.Count,
                    Description = y.Description,
                    IdOld = y.IdOld
                }).ToList()
            }).ToListAsync();
            sections.ForEach(x => x.Subsections = x.Subsections.AsQueryable().Where(filter).ToList());

            return _mapper.Map<IEnumerable<ForumSectionDto>>(sections);
        }
    }
}
