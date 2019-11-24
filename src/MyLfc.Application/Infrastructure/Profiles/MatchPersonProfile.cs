using AutoMapper;
using MyLfc.Application.Matches;
using MyLfc.Application.MatchPersons;
using MyLfc.Domain;

namespace MyLfc.Application.Infrastructure.Profiles
{
    public class MatchPersonProfile : Profile
    {
        public MatchPersonProfile()
        {
            CreateMap<UpdateMatchPersonCommand.Request, MatchPerson>();

            CreateMap<MatchPerson, GetMatchPersonListQuery.MatchPersonListDto>()
                .ForMember(dest => dest.PersonName, src => src.MapFrom(x => $"{x.Person.FirstRussianName} {x.Person.LastRussianName}"))
                .ForMember(dest => dest.PersonId, src => src.MapFrom(x => x.Person.Id))
                .ForMember(dest => dest.Number, src => src.MapFrom(x => x.Person.Number));
        }
    }
}
