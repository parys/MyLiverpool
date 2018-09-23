using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class ClubService : IClubService
    {
        private readonly IGenericRepository<Club> _clubRepository;
        private readonly IMapper _mapper;

        public ClubService(IGenericRepository<Club> clubRepository, IMapper mapper)
        {
            _clubRepository = clubRepository;
            _mapper = mapper;
        }

        public async Task<ClubDto> CreateAsync(ClubDto dto)
        {
            var club = _mapper.Map<Club>(dto);
            await _clubRepository.CreateAsync(club);
            dto = _mapper.Map<ClubDto>(club);
            return dto;
        }

        public async Task<ClubDto> UpdateAsync(ClubDto dto)
        {
            var club = await _clubRepository.GetFirstByPredicateAsync(x => x.Id == dto.Id);
            club.Name = dto.Name;
            club.EnglishName = dto.EnglishName;
            club.StadiumId = dto.StadiumId;
            club.Stadium = null;
            club.Logo = dto.Logo;
            await _clubRepository.UpdateAsync(club);
            dto = _mapper.Map<ClubDto>(club);
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await _clubRepository.DeleteAsync(x => x.Id == id);
            return true;
        }

        public async Task<ClubDto> GetByIdAsync(int id)
        {
            var model = await _clubRepository.GetFirstByPredicateAsync(x => x.Id == id, true, x => x.Include(c => c.Stadium));
            return _mapper.Map<ClubDto>(model);
        }

        public async Task<string> GetNameAsync(int clubId)
        {
            var club = await _clubRepository.GetFirstByPredicateAsync(x => x.Id == clubId);
            return club?.EnglishName.Trim() ?? string.Empty;
        }

        public async Task UpdateLogoAsync(int clubId, string relativePath)
        {
            var club = await _clubRepository.GetFirstByPredicateAsync(x => x.Id == clubId);
            club.Logo = relativePath;
            await _clubRepository.UpdateAsync(club);
        }

        public async Task UpdateLogoAsync(string name, string relativePath)
        {
            Expression<Func<Club, bool>> filter = x => string.IsNullOrWhiteSpace(name) || x.EnglishName.ToLowerInvariant() == name.ToLowerInvariant();
            var club = await _clubRepository.GetFirstByPredicateAsync(filter);
            if (club != null)
            {
                club.Logo = relativePath;
                await _clubRepository.UpdateAsync(club);
            }
        }

        public async Task<PageableData<ClubDto>> GetListAsync(ClubFiltersDto filters)
        {
            Expression<Func<Club, bool>> filter = x => true;
            if (!string.IsNullOrWhiteSpace(filters.Name))
            {
                filter = filter.And(x => x.Name.Contains(filters.Name) || x.EnglishName.Contains(filters.Name));
            }
        
            Expression<Func<Club, object>> sortBy = x => x.Name;
            if (!string.IsNullOrWhiteSpace(filters.SortBy))
            {
                if (filters.SortBy.Contains(nameof(Club.Name),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.Name;
                }
                else if (filters.SortBy.Contains(nameof(Club.EnglishName),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.EnglishName;
                }
                else if (filters.SortBy.Contains(nameof(ClubDto.StadiumName),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.Stadium.Name;
                }
            }

            var model = await _clubRepository.GetListAsync(filters.Page, filters.ItemsPerPage, true, filter,
                filters.SortOrder, sortBy, c => c.Include(x => x.Stadium));
            var clubDtos = _mapper.Map<IEnumerable<ClubDto>>(model);
            var count = await _clubRepository.CountAsync(filter);
            return new PageableData<ClubDto>(clubDtos, filters.Page, count);
        }

        public async Task<IEnumerable<KeyValuePair<int, string>>> GetClubsByNameAsync(string typed)
        {
            Expression<Func<Club, bool>> filter = x => true;
            if (!string.IsNullOrWhiteSpace(typed))
            {
                filter = filter.And(x => x.Name.Contains(typed));
            }
            var clubs = await _clubRepository.GetListAsync(1, filter: filter);
            return clubs.Select(x => new KeyValuePair<int, string>(x.Id, x.Name));
        }

        public async Task<ClubDto> GetByNameAsync(string name)
        {
            Expression<Func<Club, bool>> filter = x => string.IsNullOrWhiteSpace(name) || x.EnglishName.ToLowerInvariant() == name.ToLowerInvariant();
            var club = await _clubRepository.GetFirstByPredicateAsync(filter);
            if (club != null)
            {
                return _mapper.Map<ClubDto>(club);
            }
            return null;
        }
        
        public async Task<IEnumerable<KeyValuePair<int, string>>> GetClubsByNameWithoutLiverpoolAsync(string typed)
        {
            Expression<Func<Club, bool>> filter = x => x.EnglishName.ToLower() != "liverpool";
            if (!string.IsNullOrWhiteSpace(typed))
            {
                filter = filter.And(x => x.Name.ToLower().Contains(typed.ToLower()) || x.EnglishName.ToLower().Contains(typed.ToLower()));
            }
            var clubs = await _clubRepository.GetListAsync(1, filter: filter);
            return clubs.Select(x => new KeyValuePair<int, string>(x.Id, x.Name));
        }
    }
}
