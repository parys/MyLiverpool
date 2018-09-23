using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
    public class InjuryService: IInjuryService
    {
        private readonly IGenericRepository<Injury> _injuryRepository;
        private readonly IMapper _mapper;

        public InjuryService(IGenericRepository<Injury> injuryRepository, IMapper mapper)
        {
            _injuryRepository = injuryRepository;
            _mapper = mapper;
        }

        public async Task<InjuryDto> CreateAsync(InjuryDto dto)
        {
            var model = _mapper.Map<Injury>(dto);
            await _injuryRepository.CreateAsync(model);
            return _mapper.Map<InjuryDto>(model);
        }

        public async Task<InjuryDto> UpdateAsync(InjuryDto dto)
        {
            var model = await _injuryRepository.GetFirstByPredicateAsync(x => x.Id == dto.Id);
            if (model != null)
            {
                model.Person = null;
                model.PersonId = dto.PersonId;
                model.Description = dto.Description;
                model.StartTime = dto.StartTime;
                model.EndTime = dto.EndTime;
                await _injuryRepository.UpdateAsync(model);
            }
            return _mapper.Map<InjuryDto>(model);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await _injuryRepository.DeleteAsync(x => x.Id == id);
            return true;
        }

        public async Task<InjuryDto> GetByIdAsync(int id)
        {
            var model = await _injuryRepository.GetFirstByPredicateAsync(x => x.Id == id, true, x => x.Include(i => i.Person));
            if (model != null)
            {
                return _mapper.Map<InjuryDto>(model);
            }
            return null;
        }

        public async Task<PageableData<InjuryDto>> GetListAsync(InjuryFiltersDto filters)
        {
            Expression<Func<Injury, bool>> filter = x => true;
            if (!string.IsNullOrWhiteSpace(filters.Name))
            {
                filter = filter.And(x => x.Description.Contains(filters.Name) 
                                         || x.Person.FirstRussianName.Contains(filters.Name)
                                         || x.Person.LastRussianName.Contains(filters.Name));
            }
            Expression<Func<Injury, object>> sortBy = x => x.StartTime;
            if (!string.IsNullOrWhiteSpace(filters.SortBy))
            {
                if (filters.SortBy.Contains(nameof(InjuryDto.PersonName),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.Person.FirstRussianName;
                }
                else if (filters.SortBy.Contains(nameof(Injury.StartTime),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.StartTime;
                }
                else if (filters.SortBy.Contains(nameof(Injury.EndTime),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.EndTime;
                }
                else if (filters.SortBy.Contains(nameof(Injury.Description),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.Description;
                }
            }

            var injuries = await _injuryRepository.GetListAsync(filters.Page, filters.ItemsPerPage, true, filter,
                filters.SortOrder, sortBy, i => i.Include(c => c.Person));
            var injuryDtos = _mapper.Map<IEnumerable<InjuryDto>>(injuries);
            var count = await _injuryRepository.CountAsync(filter);
            return new PageableData<InjuryDto>(injuryDtos, filters.Page, count);
        }

        public async Task<IEnumerable<InjuryDto>> GetCurrentListAsync()
        {
            Expression<Func<Injury, bool>> filter = x => !x.EndTime.HasValue;
            var injuries = await _injuryRepository.GetQueryableList(filter: filter,
                order: SortOrder.Descending,
                orderBy: i => i.StartTime,
                include: x => x.Include(i => i.Person))
                .ToListAsync();
            return _mapper.Map<ICollection<InjuryDto>>(injuries);
        }
    }
}
