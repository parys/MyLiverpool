using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using AutoMapper;
using MyLfc.Application.Matches;
using MyLfc.Domain;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;

namespace MyLfc.Application.Infrastructure.Profiles
{
    public class MatchProfile : Profile
    {
        public MatchProfile()
        {
            CreateMap<Match, GetMatchDetailQuery.Response>()
                .ForMember(x => x.ClubName, src => src.MapFrom(x => x.Club.Name))
                .ForMember(x => x.TypeId, src => src.MapFrom(x => x.MatchType))
                .ForMember(x => x.TypeName, src => src.MapFrom(x => x.MatchType.GetNameAttribute()))
                .ForMember(x => x.ScoreAway,
                    src => src.MapFrom(x => GetScore(x.DateTime, x.Events, !x.IsHome, x.Score)))
                .ForMember(x => x.ScoreHome,
                    src => src.MapFrom(x => GetScore(x.DateTime, x.Events, x.IsHome, x.Score)))
                .ForMember(x => x.ScorePenaltyAway,
                    src => src.MapFrom(x => GetPenaltyScore(x.DateTime, x.Events, !x.IsHome)))
                .ForMember(x => x.ScorePenaltyHome,
                    src => src.MapFrom(x => GetPenaltyScore(x.DateTime, x.Events, x.IsHome)))
                .ForMember(x => x.SeasonName, src => src.MapFrom(x => $"{x.Season.StartSeasonYear}-{x.Season.StartSeasonYear+1}" ))
                .ForMember(x => x.StadiumName, src => src.MapFrom(x => x.Stadium.Name))
                .ForMember(x => x.StadiumCity, src => src.MapFrom(x => x.Stadium.City));

            CreateMap<Match, GetMatchHeaderQuery.Response>()
                .ForMember(x => x.TypeId, src => src.MapFrom(x => x.MatchType))
                .ForMember(x => x.TypeName, src => src.MapFrom(x => x.MatchType.GetNameAttribute()))
                .ForMember(x => x.ScoreAway,
                    src => src.MapFrom(x => GetScore(x.DateTime, x.Events, !x.IsHome, x.Score)))
                .ForMember(x => x.ScoreHome,
                    src => src.MapFrom(x => GetScore(x.DateTime, x.Events, x.IsHome, x.Score)))
                .ForMember(x => x.ScorePenaltyAway,
                    src => src.MapFrom(x => GetPenaltyScore(x.DateTime, x.Events, !x.IsHome)))
                .ForMember(x => x.ScorePenaltyHome,
                    src => src.MapFrom(x => GetPenaltyScore(x.DateTime, x.Events, x.IsHome)))
                .ForMember(x => x.StadiumName, src => src.MapFrom(x => x.Stadium.Name))
                .ForMember(x => x.StadiumCity, src => src.MapFrom(x => x.Stadium.City));


            CreateMap<Match, GetMatchListQuery.MatchListDto>()
                .ForMember(x => x.ClubName, src => src.MapFrom(x => x.Club.Name))
                .ForMember(x => x.TypeName, 
                    src => src.MapFrom(x => x.MatchType.GetNameAttribute()))
                .ForMember(x => x.ScoreAway,
                    src => src.MapFrom(x => GetScore(x.DateTime, x.Events, !x.IsHome, x.Score)))
                .ForMember(x => x.ScoreHome,
                    src => src.MapFrom(x => GetScore(x.DateTime, x.Events, x.IsHome, x.Score)))
                .ForMember(x => x.ScorePenaltyAway,
                    src => src.MapFrom(x => GetPenaltyScore(x.DateTime, x.Events, !x.IsHome)))
                .ForMember(x => x.ScorePenaltyHome,
                    src => src.MapFrom(x => GetPenaltyScore(x.DateTime, x.Events, x.IsHome)))
                .ForMember(x => x.StadiumName, src => src.MapFrom(x => x.Stadium.Name))
                .ForMember(x => x.StadiumCity, src => src.MapFrom(x => x.Stadium.City))
                .ForMember(x => x.ReportUrl, src => src.MapFrom(x => x.ReportUrl))
                .ForMember(x => x.CommentCount, src => src.MapFrom(x => x.Comments.Count))
                .ForMember(x => x.TypeId, src => src.MapFrom(x => x.MatchType));

            CreateMap<CreateMatchCommand.Request, Match>()
                .ForMember(x => x.MatchType, src => src.MapFrom(x => x.TypeId));

            CreateMap<Match, GetMatchCalendarQuery.CalendarMatchDto>()
                .ForMember(x => x.StadiumName, src => src.MapFrom(x => x.Stadium.Name))
                .ForMember(x => x.StadiumCity, src => src.MapFrom(x => x.Stadium.City))
                .ForMember(x => x.TypeName,
                    src => src.MapFrom(x => x.MatchType.GetNameAttribute()))
                .ForMember(x => x.ScoreAway,
                    src => src.MapFrom(x => GetScore(x.DateTime, x.Events, !x.IsHome, x.Score)))
                .ForMember(x => x.ScoreHome,
                    src => src.MapFrom(x => GetScore(x.DateTime, x.Events, x.IsHome, x.Score)))
                .ForMember(x => x.ScorePenaltyAway,
                    src => src.MapFrom(x => GetPenaltyScore(x.DateTime, x.Events, !x.IsHome)))
                .ForMember(x => x.ScorePenaltyHome,
                    src => src.MapFrom(x => GetPenaltyScore(x.DateTime, x.Events, x.IsHome)));

            CreateMap<UpdateMatchCommand.Request, Match>()
                .ForMember(x => x.MatchType, src => src.MapFrom(x => x.TypeId));
        }
        
        private static string GetScore(DateTimeOffset dateTime, IEnumerable<MatchEvent> events, bool isHome, string score)
        {
            if (DateTimeOffset.Now >= dateTime)
            {
                return events.Any()
                    ? CalculateScore(events, isHome)
                    : score == null
                        ? "0"
                        : isHome
                            ? score.Split('-', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault()
                            : score.Split('-', StringSplitOptions.RemoveEmptyEntries).LastOrDefault();
            }
            return null;
        }

        private static int? GetPenaltyScore(DateTimeOffset dateTime, IEnumerable<MatchEvent> events, bool isHome)
        {
            if (DateTimeOffset.Now >= dateTime)
            {
                var filteredEvents = events.Where(x => x.Type == MatchEventType.GoalPenaltySeries);
                if (filteredEvents.Any())
                {
                    return isHome ? filteredEvents.Count(x => x.IsOur) : filteredEvents.Count(x => !x.IsOur);
                }
            }
            return null;
        }

        private static string CalculateScore(IEnumerable<MatchEvent> matchEvents, bool forLiverpool = true)
        {
            Expression<Func<MatchEvent, bool>> filter = x => forLiverpool ? x.IsOur : !x.IsOur;
            filter = filter.And(x =>
                x.Type == MatchEventType.Goal ||
                x.Type == MatchEventType.GoalPenalty ||
                x.Type == MatchEventType.GoalOwn);

            return matchEvents.Count(filter.Compile()).ToString();
        }
    }
}
