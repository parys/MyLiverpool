using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using AutoMapper;
using MyLiverpool.Business.Dto;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Common.Mappings
{
    public class MatchMapperProfile : Profile
    {
        public MatchMapperProfile()
        {
            RegisterMatchMapper();
        }

        private void RegisterMatchMapper()
        {
            CreateMap<Match, MatchDto>()
                .ForMember(x => x.ClubId, src => src.MapFrom(x => x.ClubId))
                .ForMember(x => x.ClubName, src => src.MapFrom(x => x.Club.Name))
                .ForMember(x => x.DateTime, src => src.MapFrom(x => x.DateTime))
                .ForMember(x => x.Id, src => src.MapFrom(x => x.Id))
                .ForMember(x => x.Events, src => src.MapFrom(x => x.Events.OrderBy(y => y.Minute)))
                .ForMember(x => x.IsHome, src => src.MapFrom(x => x.IsHome))
                .ForMember(x => x.TypeId, src => src.MapFrom(x => x.MatchType))
                .ForMember(x => x.TypeName, src => src.MapFrom(x => x.MatchType.GetNameAttribute()))
                .ForMember(x => x.ScoreAway,
                    src => src.MapFrom(x => GetScore(x.Score, x.DateTime, x.Events, !x.IsHome)))
                .ForMember(x => x.ScoreHome,
                    src => src.MapFrom(x => GetScore(x.Score, x.DateTime, x.Events, x.IsHome)))
                .ForMember(x => x.ScorePenaltyAway, 
                    src => src.MapFrom(x => GetPenaltyScore(x.DateTime, x.Events, !x.IsHome)))
                .ForMember(x => x.ScorePenaltyHome, 
                    src => src.MapFrom(x => GetPenaltyScore(x.DateTime, x.Events, x.IsHome)))
                .ForMember(x => x.PhotoUrl, src => src.MapFrom(x => x.PhotoUrl))
                .ForMember(x => x.StadiumName, src => src.MapFrom(x => x.Stadium.Name))
                .ForMember(x => x.StadiumCity, src => src.MapFrom(x => x.Stadium.City))
                .ForMember(x => x.ReportUrl, src => src.MapFrom(x => x.ReportUrl))
                .ForMember(x => x.CommentCount, src => src.MapFrom(x => x.Comments.Count))
                .ForMember(x => x.VideoUrl, src => src.MapFrom(x => x.VideoUrl));

            CreateMap<MatchDto, Match>()
                .ForMember(x => x.ClubId, src => src.MapFrom(x => x.ClubId))
                .ForMember(x => x.DateTime, src => src.MapFrom(x => x.DateTime))
                .ForMember(x => x.Id, src => src.MapFrom(x => x.Id))
                .ForMember(x => x.IsHome, src => src.MapFrom(x => x.IsHome))
                .ForMember(x => x.MatchType, src => src.MapFrom(x => x.TypeId))
                .ForMember(x => x.Score, src => src.MapFrom(x => GetScores(x.ScoreHome, x.ScoreAway)))
                .ForMember(x => x.PhotoUrl, src => src.MapFrom(x => x.PhotoUrl))
                .ForMember(x => x.ReportUrl, src => src.MapFrom(x => x.ReportUrl))
                .ForMember(x => x.VideoUrl, src => src.MapFrom(x => x.VideoUrl));
        }

        private static string GetScores(string scoreHome, string scoreAway)
        {
            if (string.IsNullOrWhiteSpace(scoreHome) || string.IsNullOrWhiteSpace(scoreAway))
            {
                return null;
            }
            return $"{scoreHome}-{scoreAway}";
        }

        private static string GetScore(string score, DateTimeOffset dateTime, IEnumerable<MatchEvent> events, bool isHome)
        {
            if (DateTimeOffset.Now >= dateTime)
            {
                return events.Any()
                    ? CalculateScore(events, isHome)
                    : score == null
                        ? "0-0"
                        : isHome
                            ? score?.Split('-', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault()
                            : score?.Split('-', StringSplitOptions.RemoveEmptyEntries).LastOrDefault();
            }
            return null;
        }

        private static int? GetPenaltyScore(DateTimeOffset dateTime, IEnumerable<MatchEvent> events, bool isHome)
        {
            if (DateTimeOffset.Now >= dateTime)
            {
                var filteredEvents = events.Where(x => x.Type == MatchEventType.GoalPenaltySeries);
                if(filteredEvents.Any())
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
