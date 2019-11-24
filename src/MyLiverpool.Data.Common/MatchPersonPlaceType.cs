using System.ComponentModel.DataAnnotations;

namespace MyLiverpool.Data.Common
{
    public enum MatchPersonPlaceType
    {
        HomeTeam = 1,
        HomeBench = 2,
        HomeCoach = 3,
        HomeInjury = 4,
        HomeBan = 5,
        AwayTeam = 6,
        AwayBench = 7,
        AwayCoach = 8,
        AwayInjury = 9,
        AwayBan = 10,
        MainRef = 11,
        AssistantRef = 12,
        AdditionalRef = 13,
        FourthRef = 14
    }
}
