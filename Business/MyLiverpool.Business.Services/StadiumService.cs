using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class StadiumService : IStadiumService
    {
        private readonly IGenericRepository<Stadium> _stadiumRepository;
        private readonly IMapper _mapper;

        public StadiumService(IGenericRepository<Stadium> stadiumRepository, IMapper mapper)
        {
            _stadiumRepository = stadiumRepository;
            _mapper = mapper;
        }

        public async Task<StadiumDto> GetByIdAsync(int id)
        {
            var stadium = await _stadiumRepository.GetFirstByPredicateAsync(x => x.Id == id);
            if (stadium != null)
            {
                return _mapper.Map<StadiumDto>(stadium);
            }
            return null;
        }
        
        public async Task<IEnumerable<StadiumDto>> GeListAsync()
        {
            var stadiums = await _stadiumRepository.GetListAsync(null, 0);
            return _mapper.Map<IEnumerable<StadiumDto>>(stadiums);
        }

        public async Task<PageableData<StadiumDto>> GeListAsync(int page)
        {
            var stadiums = await _stadiumRepository.GetListAsync(page, orderBy: x => x.Name);
            var dtos = _mapper.Map<ICollection<StadiumDto>>(stadiums);
            var count = await _stadiumRepository.CountAsync();
            return new PageableData<StadiumDto>(dtos, page, count);
        }

        public async Task<StadiumDto> CreateAsync(StadiumDto dto)
        {
            var stadium = _mapper.Map<Stadium>(dto);
            var result = await _stadiumRepository.CreateAsync(stadium);
            return _mapper.Map<StadiumDto>(result);
        }

        public async Task<StadiumDto> UpdateAsync(StadiumDto dto)
        {
            var stadium = await _stadiumRepository.GetFirstByPredicateAsync(x => x.Id == dto.Id);
            stadium.Name = dto.Name;
            stadium.City = dto.City;
            await _stadiumRepository.UpdateAsync(stadium);
            return _mapper.Map<StadiumDto>(stadium);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                await _stadiumRepository.DeleteAsync(x => x.Id == id);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public async Task<IEnumerable<StadiumDto>> GetListByNameAsync(string typed)
        {
            Expression<Func<Stadium, bool>> filter = x => string.IsNullOrWhiteSpace(typed) || x.Name.Contains(typed);
            var list = await _stadiumRepository.GetListAsync(1, GlobalConstants.CountStadiumsForAutocomlete, true, filter);
            return _mapper.Map<IEnumerable<StadiumDto>>(list);
        }

        public async Task<PageableData<StadiumDto>> GetListAsync(StadiumFiltersDto filters)
        {
            Expression<Func<Stadium, bool>> filter = x => true;
            if(!string.IsNullOrWhiteSpace(filters.Name))
            {
                filter = filter.And(x => x.Name.Contains(filters.Name));
            }
            var stadiums = await _stadiumRepository.GetListAsync(filters.Page, filters.ItemsPerPage, true, filter, orderBy: x => x.Name);
            var dtos = _mapper.Map<ICollection<StadiumDto>>(stadiums);
            var count = await _stadiumRepository.CountAsync(filter);
            return new PageableData<StadiumDto>(dtos, filters.Page, count);
        }
    }
}
