﻿using AutoMapper;
using MyLiverpool.Business.DtoNext;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Common.Mappings
{
    public class PersonMapperProfile : Profile
    {
        public PersonMapperProfile()
        {
            RegisterPersonMap();
        }
        
        private void RegisterPersonMap()
        {
            CreateMap<Person, PersonDto>()
                .ForMember(dest => dest.TypeName, src => src.MapFrom(x => x.Type.ToString()));

            CreateMap<PersonDto, Person>();
        }
    }
}