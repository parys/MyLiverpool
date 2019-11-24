using System;
using MyLiverpool.Data.Common;

namespace MyLfc.Application.Infrastructure
{
    public static class MatchPersonHelpers
    {
        public static MatchPersonPlaceType GetMatchPlaceholderType(this MatchPersonType personType, bool isHome)
        {
            switch (personType)
            {
                case MatchPersonType.Team:
                    {
                        return isHome ? MatchPersonPlaceType.HomeTeam : MatchPersonPlaceType.AwayTeam;
                    }
                case MatchPersonType.TeamBench:
                    {
                        return isHome ? MatchPersonPlaceType.HomeBench : MatchPersonPlaceType.AwayBench;
                    }
                case MatchPersonType.Ban:
                    {
                        return isHome ? MatchPersonPlaceType.HomeBan : MatchPersonPlaceType.AwayBan;
                    }
                case MatchPersonType.Injury:
                    {
                        return isHome ? MatchPersonPlaceType.HomeInjury : MatchPersonPlaceType.AwayInjury;
                    }
                case MatchPersonType.Coach:
                    {
                        return isHome ? MatchPersonPlaceType.HomeCoach : MatchPersonPlaceType.AwayCoach;
                    }
                case MatchPersonType.Competitor:
                    {
                        return !isHome ? MatchPersonPlaceType.HomeTeam : MatchPersonPlaceType.AwayTeam;
                    }
                case MatchPersonType.CompetitorBench:
                    {
                        return !isHome ? MatchPersonPlaceType.HomeBench : MatchPersonPlaceType.AwayBench;
                    }
                case MatchPersonType.BanCompetitor:
                    {
                        return !isHome ? MatchPersonPlaceType.HomeBan : MatchPersonPlaceType.AwayBan;
                    }
                case MatchPersonType.InjuryCompetitor:
                    {
                        return !isHome ? MatchPersonPlaceType.HomeInjury : MatchPersonPlaceType.AwayInjury;
                    }
                case MatchPersonType.CompetitorCoach:
                    {
                        return !isHome ? MatchPersonPlaceType.HomeCoach : MatchPersonPlaceType.AwayCoach;
                    }
                case MatchPersonType.MainReferee:
                    {
                        return MatchPersonPlaceType.MainRef;
                    }
                case MatchPersonType.AdditionalReferee:
                    {
                        return MatchPersonPlaceType.AdditionalRef;
                    }
                case MatchPersonType.SubReferee:
                    {
                        return MatchPersonPlaceType.AssistantRef;
                    }
                case MatchPersonType.FourthReferee:
                    {
                        return MatchPersonPlaceType.FourthRef;
                    }
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}
