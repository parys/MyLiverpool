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
using MyLiverpool.Common.Utilities;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class MatchService : IMatchService
    {
        private readonly IClubService _clubService;
        private readonly ICommentService _commentService;
        private readonly IMapper _mapper;
        private readonly IGenericRepository<Match> _matchRepository;

        public MatchService(IGenericRepository<Match> matchRepository, IMapper mapper,
            IClubService clubService, ICommentService commentService)
        {
            _clubService = clubService;
            _commentService = commentService;
            _mapper = mapper;
            _matchRepository = matchRepository;
        }

        public async Task<MatchDto> CreateAsync(MatchDto dto)
        {
            var match = _mapper.Map<Match>(dto);
            match = await _matchRepository.CreateAsync(match);
            dto = _mapper.Map<MatchDto>(match);
            return dto;
        }

        public async Task<MatchDto> UpdateAsync(MatchDto dto)
        {
            var match = await _matchRepository.GetFirstByPredicateAsync(x => x.Id == dto.Id);
            match.DateTime = dto.DateTime;//todo think about it use automapper?
            match.IsHome = dto.IsHome;
            match.MatchType = (MatchTypeEnum)dto.TypeId;
            match.ClubId = dto.ClubId;
            match.Club = null;
            match.ReportUrl = dto.ReportUrl;
            match.PhotoUrl = dto.PhotoUrl;
            match.VideoUrl = dto.VideoUrl;
            match.Stadium = null;
            match.StadiumId = dto.StadiumId;
            match.SeasonId = dto.SeasonId;
            match.PreviewId = dto.PreviewId;
            match.ReportId = dto.ReportId;
            await _matchRepository.UpdateAsync(match);
            return dto;
        }

        public async Task<IEnumerable<MatchDto>> GetForCalendarAsync()
        {
            var liverpoolClub = await _clubService.GetByNameAsync(GlobalConstants.LiverpoolClubEnglishName);
            if (liverpoolClub == null)
            {
                return null;
            }
            var lastMatch = await GetLastMatchAsync();
            var nextMatch = await GetNextMatchAsync();
            var dtos = new List<MatchDto>();
            var matches = new List<Match>();
            if (lastMatch != null)
            {
                matches.Add(lastMatch);
            }
            if (nextMatch != null)
            {
                matches.Add(nextMatch);
            }
            foreach (var match in matches)
            {
                var dto = _mapper.Map<MatchDto>(match);
                var clubDto = _mapper.Map<ClubDto>(match.Club);
                if (match.IsHome)
                {
                    FillClubsFields(dto, liverpoolClub, clubDto);
                }
                else
                {
                    FillClubsFields(dto, clubDto, liverpoolClub);
                }
                dtos.Add(dto);
            }
            return dtos;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await _matchRepository.DeleteAsync(x => x.Id == id);
            return true;
        }

        public async Task<MatchDto> GetByIdAsync(int id)
        {
            var liverpoolClub = await _clubService.GetByNameAsync(GlobalConstants.LiverpoolClubEnglishName);
            if (liverpoolClub == null)
            {
                return null;
            }
            var match = await _matchRepository.GetQueryableList(filter: x => x.Id == id, asNoTracking: true, 
                include: x => x.Include(m => m.Club)
                .Include(m => m.Stadium)
                .Include(m => m.Events).ThenInclude(m => m.Person))
                .FirstOrDefaultAsync();
            if (match == null)
            {
                return null;
            }
            var dto = _mapper.Map<MatchDto>(match);
            var clubDto = _mapper.Map<ClubDto>(match.Club);
            if (match.IsHome)
            {
                FillClubsFields(dto, liverpoolClub, clubDto);
            }
            else
            {
                FillClubsFields(dto, clubDto, liverpoolClub);
            }
            dto.CommentCount = await _commentService.CountAsync(x => x.MatchId == dto.Id);

            return dto;
        }

        public async Task<PageableData<MatchDto>> GetListAsync(int page, int itemsPerPage = 15, int? seasonId = null)
        {
            return await GetListAsync(new MatchFiltersDto
            {
                Page = page,
                ItemsPerPage = itemsPerPage,
                SeasonId = seasonId
            });
        }

        public async Task<PageableData<MatchDto>> GetListAsync(MatchFiltersDto filters)
        {
            Expression<Func<Match, bool>> filter = m => true;
            if (filters.SeasonId.HasValue)
            {
                filter = filter.And(m => m.SeasonId == filters.SeasonId.Value);
            }
            var dtos = await GetMatchesAsync(filters.Page, filters.ItemsPerPage, filter);
            var count = await _matchRepository.CountAsync(filter);
            return new PageableData<MatchDto>(dtos, filters.Page, count);
        }

        public async Task<IEnumerable<MatchDto>> GetListForSeasonAsync(int seasonId)
        {
            var pageForGettingAllItems = 1;
            var itemsPerPageForMatch = 100;
            var result = await GetMatchesAsync(pageForGettingAllItems, itemsPerPageForMatch, x => x.SeasonId == seasonId);
            var dtos = _mapper.Map<IEnumerable<MatchDto>>(result);
            return dtos;
        }

        private async Task<IEnumerable<MatchDto>> GetMatchesAsync(int? page, int itemsPerPage,
            Expression<Func<Match, bool>> filter)
        {
            var liverpoolClub = await _clubService.GetByNameAsync(GlobalConstants.LiverpoolClubEnglishName);
            var matches = await _matchRepository.GetListAsync(page, itemsPerPage, true, filter,
                orderBy: m => m.DateTime,
                include: x => x.Include(m => m.Club)
                    .Include(m => m.Stadium)
                    .Include(m => m.Events));
            var dtos = new List<MatchDto>();
            foreach (var match in matches)
            {
                var dto = _mapper.Map<MatchDto>(match);
                var clubDto = _mapper.Map<ClubDto>(match.Club);
                if (match.IsHome)
                {
                    FillClubsFields(dto, liverpoolClub, clubDto);
                }
                else
                {
                    FillClubsFields(dto, clubDto, liverpoolClub);
                }
                dtos.Add(dto);
            }
            return dtos;
        }

        private static void FillClubsFields(MatchDto dto, ClubDto homeClub, ClubDto awayClub)
        {
            dto.HomeClubId = homeClub.Id;
            dto.HomeClubName = homeClub.Name;
            dto.HomeClubLogo = homeClub.Logo;
            dto.AwayClubId = awayClub.Id;
            dto.AwayClubName = awayClub.Name;
            dto.AwayClubLogo = awayClub.Logo;
        }

        private async Task<Match> GetLastMatchAsync()
        {
            return await _matchRepository
                .GetQueryableList(order: SortOrder.Ascending,
                    orderBy: m => m.DateTime,
                    include: x => x.Include(m => m.Club).Include(m => m.Events))
                .LastOrDefaultAsync(m => m.DateTime <= DateTimeOffset.Now.AddHours(0.5));
        }

        private async Task<Match> GetNextMatchAsync()
        {
            return await _matchRepository
                .GetQueryableList(order: SortOrder.Ascending,
                    orderBy: m => m.DateTime,
                    include: x=> x.Include(m => m.Club)
                        .Include(m => m.Stadium)
                        .Include(m => m.Events))
                .FirstOrDefaultAsync(m => m.DateTime >= DateTimeOffset.Now.AddHours(0.5));
        }
    }
}
