using AutoMapper;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Common.Mappings
{
    public class ChatMessageMapperProfile : Profile
    {
        public ChatMessageMapperProfile()
        {
            RegisterChatMessageMap();
        }

        private void RegisterChatMessageMap()
        {
            CreateMap<ChatMessage, ChatMessageDto>()
                .ForMember(dest => dest.UserName, src => src.MapFrom(x => x.Author.UserName));
            
            CreateMap<ChatMessageDto, ChatMessage>();
        }
    }
}
