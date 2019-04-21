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
    public class PersonService: IPersonService
    {
        private readonly IMapper _mapper;
        private readonly IGenericRepository<Person> _personRepository;
        private readonly IHelperService _helperEntityService;

        public PersonService(IMapper mapper, IHelperService helperEntityService, IGenericRepository<Person> personRepository)
        {
            _mapper = mapper;
            _helperEntityService = helperEntityService;
            _personRepository = personRepository;
        }

        public async Task<PersonDto> CreateAsync(PersonDto dto)
        {
            var model = _mapper.Map<Person>(dto);
            var result = await _personRepository.CreateAsync(model);
            return _mapper.Map<PersonDto>(result);
        }

        public async Task<PageableData<PersonDto>> GetListAsync(PersonFiltersDto dto)
        {
            Expression<Func<Person, bool>> filter = x => true;
            if (dto.Type.HasValue)
            {
                filter = filter.And(x => x.Type == dto.Type.Value);
            }
            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                filter = filter.And(x => x.FirstName.Contains(dto.Name) ||
                                         x.LastName.Contains(dto.Name) ||
                                         x.FirstRussianName.Contains(dto.Name) ||
                                         x.LastRussianName.Contains(dto.Name));
            }

            if (dto.MatchId.HasValue)
            {
                filter = filter.And(x => x.Matches.Any(m => m.MatchId == dto.MatchId.Value));
            }

            Expression<Func<Person, object>> sortBy = x => x.LastRussianName;
            if (!string.IsNullOrWhiteSpace(dto.SortBy))
            {
                if (dto.SortBy.Contains(nameof(Person.LastRussianName),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.LastRussianName;
                }
                else if (dto.SortBy.Contains(nameof(Person.FirstRussianName),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.FirstRussianName;
                }
                else if (dto.SortBy.Contains(nameof(Person.Birthday),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.Birthday;
                }
                else if (dto.SortBy.Contains(nameof(Person.Position),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.Position;
                }else if (dto.SortBy.Contains(nameof(Person.Country),
                    StringComparison.InvariantCultureIgnoreCase))
                {
                    sortBy = x => x.Country;
                }
            }
            var model = await _personRepository.GetListAsync(dto.Page, dto.ItemsPerPage, true, filter, dto.SortOrder, sortBy);
            var personDto = _mapper.Map<IEnumerable<PersonDto>>(model);
            var count = await _personRepository.CountAsync(filter);
            return new PageableData<PersonDto>(personDto, dto.Page, count, dto.ItemsPerPage);
        }

        public async Task<PersonDto> GetByIdAsync(int id)
        {
            var person = await _personRepository.GetFirstByPredicateAsync(x => x.Id == id);
            return _mapper.Map<PersonDto>(person);
        }

        public async Task<PersonDto> UpdateAsync(PersonDto dto)
        {
            var person = await _personRepository.GetFirstByPredicateAsync(x => x.Id == dto.Id);
            if (person == null)
            {
                return null;
            }
            person.Birthday = dto.Birthday;
            person.FirstName = dto.FirstName;
            person.FirstRussianName = dto.FirstRussianName;
            person.LastName = dto.LastName;
            person.LastRussianName = dto.LastRussianName;
            person.Photo = dto.Photo;
            person.Type = dto.Type;
            person.Position = dto.Position;
            person.Country = dto.Country;
            person.Number = dto.Number;
            await _personRepository.UpdateAsync(person);
            return _mapper.Map<PersonDto>(person);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await _personRepository.DeleteAsync(x => x.Id == id);
            return true;
        }
        
        public async Task<PersonDto> GetBestPlayerAsync()
        {
            var playerHelpEntity = await _helperEntityService.GetAsync(HelperEntityType.BestPlayer);
            if (playerHelpEntity != null && int.TryParse(playerHelpEntity.Value, out int playerId))
            {
                var player = await _personRepository.GetFirstByPredicateAsync(x => x.Id == playerId);
                return _mapper.Map<PersonDto>(player);
            }
            return null;
        }

        //public async Task SetBestPlayerAsync(int personId)
        //{
            //var entity = new HelpEntity()
            //{
            //    Type = HelperEntityType.BestPlayer,
            //    Value = personId.ToString()
            //};
            //await _helperEntityService.UpdateAndSaveAsync(entity);
        //}

        public async Task<IEnumerable<PersonDto>> GetStuffListAsync(PersonType personType)
        {
            var stuffList1 = await _personRepository.GetListAsync(filter: x => x.Type == personType);
            var stuffList = stuffList1.ToList();
            var tempList = new List<Person>();
            var coach = stuffList.FirstOrDefault(x => x.Position == "Главный тренер");
            if (coach != null)
            {
                tempList.Add(coach);
                stuffList.Remove(coach);
            }
            var assistants = stuffList.Where(x => x.Position == "Помощник тренера").ToList();
            if(assistants.Any())
            {
                foreach (var assistant in assistants)
                {
                    tempList.Add(assistant);
                    stuffList.Remove(assistant);
                }
            }
            tempList.AddRange(stuffList);
            return _mapper.Map<IEnumerable<PersonDto>>(tempList);
        }

        public async Task<SquadListDto> GetSquadListAsync(PersonType type)
        {
            Expression<Func<Person, bool>> filter = x => true;
            if (type == PersonType.Loan)
            {
                filter = x => x.Transfers.Any(y => y.OnLoan && !y.Coming && y.FinishDate.Value.Date >= DateTime.Today.Date);
            }
            else if (type == PersonType.First)
            {
                filter = x => x.Type == PersonType.First &&
                              !x.Transfers.Any(y => y.OnLoan && !y.Coming &&
                                                   y.FinishDate.Value.Date >= DateTime.Today.Date);
            }
            else if (type == PersonType.Academy)
            {
                filter = x => x.Type == PersonType.Academy &&
                              !x.Transfers.Any(y => y.OnLoan && !y.Coming &&
                                                    y.FinishDate.Value.Date >= DateTime.Today.Date);
            }
            var squadList1 = await _personRepository.GetListAsync(filter: filter);
            var squadList = _mapper.Map<IEnumerable<PersonDto>>(squadList1).ToList();
            var goalkeepers = squadList.Where(x => x.Position == "Вратарь");
            var defenders = squadList.Where(x => x.Position == "Защитник");
            var midfielders = squadList.Where(x => x.Position == "Полузащитник");
            var strikers = squadList.Where(x => x.Position == "Форвард");
            return new SquadListDto
            {
                Goalkeepers = goalkeepers.OrderBy(x => x.Number),
                Defenders = defenders.OrderBy(x => x.Number),
                Midfielders = midfielders.OrderBy(x => x.Number),
                Strikers = strikers.OrderBy(x => x.Number)
            };
        }

        public async Task<IEnumerable<KeyValuePair<int, string>>> GetPersonsByNameAsync(string typed)
        {
            typed = typed?.ToLowerInvariant();
            Expression<Func<Person, bool>> filter = x => true;
            if (!string.IsNullOrWhiteSpace(typed))
            {
                filter = filter.And(x => x.FirstName.ToLower().Contains(typed) ||
                                         x.FirstRussianName.ToLower().Contains(typed) ||
                                         x.LastName.ToLower().Contains(typed) ||
                                         x.LastRussianName.ToLower().Contains(typed));
            }
            var persons = await _personRepository.GetListAsync(1, filter: filter);
            return persons.Select(x => new KeyValuePair<int, string>(x.Id, x.RussianName));
        }

        public async Task<IEnumerable<PersonDto>> GetBirthdaysAsync()
        {
            Expression<Func<Person, bool>> filter = x => x.Birthday.HasValue &&
                                                       x.Birthday.Value.Date.Day == DateTimeOffset.Now.Date.Day &&
                                                       x.Birthday.Value.Date.Month == DateTimeOffset.Now.Date.Month &&
                                                       x.Type != PersonType.Rival &&
                                                       x.Type != PersonType.CompetitorCoach &&
                                                       x.Type != PersonType.Referee;
            var list = await _personRepository
                .GetQueryableList(asNoTracking: true, filter: filter)
                .ToListAsync();
            return _mapper.Map<IEnumerable<PersonDto>>(list);
        }
    }
}

