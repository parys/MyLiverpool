﻿using System.Linq;
using AutoMapper;
using MyLfc.Application.RoleGroups;
using MyLfc.Domain;

namespace MyLfc.Application.Infrastructure.Profiles
{
    public class RoleGroupProfile : Profile
    {
        public RoleGroupProfile()
        {
            CreateMap<RoleGroup, GetRoleGroupsQuery.RoleGroupListDto>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.Id))
                .ForMember(dest => dest.Name, src => src.MapFrom(x => x.RussianName))
                .ForMember(dest => dest.Roles, src => src.MapFrom(x => x.RoleGroups.Select(y => y.Role)));

            CreateMap<Role, GetRoleGroupsQuery.RoleDto>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.Id))
                .ForMember(dest => dest.Name, src => src.MapFrom(x => x.Name));
        }
    }
}
