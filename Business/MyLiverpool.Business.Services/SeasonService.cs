using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
    public class SeasonService : ISeasonService
    {
        private readonly IMapper _mapper;
        private readonly IGenericRepository<Season> _seasonRepository;
        private readonly IHelperService _helperService;
        private readonly IMatchService _matchService;

        public SeasonService(IMapper mapper, IGenericRepository<Season> seasonRepository, IHelperService helperService, IMatchService matchService)
        {
            _mapper = mapper;
            _seasonRepository = seasonRepository;
            _helperService = helperService;
            _matchService = matchService;
        }

        public async Task<SeasonDto> CreateAsync(SeasonDto dto)
        {
            var model = _mapper.Map<Season>(dto);
            var result = await _seasonRepository.CreateAsync(model);
            return _mapper.Map<SeasonDto>(result);
        }

        public async Task<SeasonDto> UpdateAsync(SeasonDto dto)
        {
            var model = await _seasonRepository.GetFirstByPredicateAsync(x => x.Id == dto.Id);
            model.StartSeasonYear = dto.StartSeasonYear;
            await _seasonRepository.UpdateAsync(model);
            var result = _mapper.Map<SeasonDto>(model);
            return result;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await _seasonRepository.DeleteAsync(x => x.Id == id);
            return true;
        }

        public async Task<SeasonDto> GetByIdAsync(int id)
        {
            var model = await _seasonRepository.GetFirstByPredicateAsync(x => x.Id == id);
            var dto = _mapper.Map<SeasonDto>(model);
            return dto;
        }

        public async Task<ICollection<SeasonDto>> GetListAsync()
        {
            var seasons = await _seasonRepository.GetListAsync(order: SortOrder.Descending, orderBy: x => x.StartSeasonYear);
            var dtos = _mapper.Map<ICollection<SeasonDto>>(seasons);
            return dtos;
        }

        public async Task<PageableData<SeasonDto>> GetListAsync(SeasonFiltersDto filters)
        {
            Expression<Func<Season, bool>> filter = x => true;
            if (!string.IsNullOrWhiteSpace(filters.Name))
            {
                filter = filter.And(x => x.StartSeasonYear.ToString().Contains(filters.Name));
            }
            var stadiums = await _seasonRepository.GetListAsync(filters.Page, filters.ItemsPerPage, true, filter, orderBy: x => x.StartSeasonYear);
            var dtos = _mapper.Map<ICollection<SeasonDto>>(stadiums);
            var count = await _seasonRepository.CountAsync(filter);
            return new PageableData<SeasonDto>(dtos, filters.Page, count);
        }

        public async Task<SeasonDto> GetByIdWithMatchesAsync(int id)
        {
            if (id == 0)
            {
                id = await GetCurrentSeasonIdAsync();
            }
            var season = await _seasonRepository.GetFirstByPredicateAsync(x => x.Id == id, true, x => x.Include(s => s.Matches));
            
            if (season == null)
            {
                return null;
            }
            var seasonDto = _mapper.Map<SeasonDto>(season);
            seasonDto.Matches = await _matchService.GetListForSeasonAsync(season.Id);
            return seasonDto;
        }

        public async Task<IEnumerable<KeyValuePair<int, string>>> GetSeasonsByYearAsync(string typed)
        {
            Expression<Func<Season, bool>> filter = x => x.StartSeasonYear.ToString().Contains(typed);
            
            var clubs = await _seasonRepository.GetListAsync(filter: filter);
            return clubs.Select(x => new KeyValuePair<int, string>(x.Id, $"{x.StartSeasonYear.ToString()}-{x.EndSeasonYear.ToString()}"));
        }

        //todo rewrite to cached prop maybe init on start
        public async Task<int> GetCurrentSeasonIdAsync()
        {
            return Int32.Parse(await _helperService.GetValueAsync(HelperEntityType.CurrentSeason) ?? DateTime.Today.Year.ToString());
        }

        public async Task SetCurrentSeasonAsync(int currentSeasonId)
        {
            await _helperService.CreateOrUpdateAsync(HelperEntityType.CurrentSeason, currentSeasonId.ToString());
        }
    }
}
