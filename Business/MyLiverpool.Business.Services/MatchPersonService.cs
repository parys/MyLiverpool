using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class MatchPersonService : IMatchPersonService
    {
        private readonly IGenericRepository<MatchPerson> _matchPersonRepository;
        private readonly IMapper _mapper;

        public MatchPersonService(IGenericRepository<MatchPerson> matchPersonRepository, IMapper mapper)
        {
            _matchPersonRepository = matchPersonRepository;
            _mapper = mapper;
        }

        public async Task<MatchPersonDto> CreateAsync(MatchPersonDto dto)
        {
            var entity = _mapper.Map<MatchPerson>(dto);
            entity.Created = DateTime.Now;
            await _matchPersonRepository.CreateAsync(entity);
            return dto;
        }

        public async Task<MatchPersonDto> UpdateAsync(MatchPersonDto dto)
        {
            var entity = await _matchPersonRepository.GetFirstByPredicateAsync(x => x.MatchId == dto.MatchId && x.PersonId == dto.PersonId);
            if (entity != null)
            {
                entity.PersonType = dto.PersonType;
                entity.Person = null;
                entity.Match = null;
                await _matchPersonRepository.UpdateAsync(entity);
                return _mapper.Map<MatchPersonDto>(entity);
            }
            return await CreateAsync(dto);
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException("Complex key");
        }

        public Task<MatchPersonDto> GetByIdAsync(int id)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<MatchPersonDto>> GetListByMatchIdAsync(int matchId)
        {
            var events = await _matchPersonRepository.GetQueryableList(filter: x => x.MatchId == matchId, 
                order: SortOrder.Ascending, 
                orderBy:x => x.Created, include: x => x.Include(m => m.Person))
                .ToListAsync();

            return _mapper.Map<IEnumerable<MatchPersonDto>>(events);
        }

        public async Task<bool> DeleteAsync(int matchId, int personId)
        {
            return await _matchPersonRepository.DeleteAsync(x => x.MatchId == matchId && x.PersonId == personId);
        }
    }
}
