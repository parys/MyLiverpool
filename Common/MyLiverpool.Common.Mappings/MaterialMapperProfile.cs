using System;
using System.Linq;
using AutoMapper;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Common.Mappings
{
    public class MaterialMapperProfile : Profile
    {
        public MaterialMapperProfile()
        {
            RegisterMaterialMapping();
        }
        
        private void RegisterMaterialMapping()
        {
            CreateMap<Material, MaterialMiniDto>()
                .ForMember(dest => dest.AdditionTime, src => src.MapFrom(x => x.AdditionTime))
                .ForMember(dest => dest.UserId, src => src.MapFrom(x => x.AuthorId))
                .ForMember(dest => dest.UserName, src => src.MapFrom(x => x.Author.UserName))
                .ForMember(dest => dest.Brief, src => src.MapFrom(x => x.Brief))
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.Id))
                .ForMember(dest => dest.CategoryId, src => src.MapFrom(x => x.CategoryId))
                .ForMember(dest => dest.CategoryName, src => src.MapFrom(x => x.Category.Name))
                .ForMember(dest => dest.CommentsCount, src => src.MapFrom(x => x.CommentsCount))
                .ForMember(dest => dest.Pending, src => src.MapFrom(x => x.Pending))
                .ForMember(dest => dest.Title, src => src.MapFrom(x => x.Title))
                .ForMember(dest => dest.PhotoPreview, src => src.MapFrom(x => x.PhotoPreview ?? x.PhotoPath))
                .ForMember(dest => dest.Photo, src => src.MapFrom(x => x.PhotoPreview ?? x.PhotoPath)) //remove when cache will updated
                .ForMember(dest => dest.Type, src => src.MapFrom(x => x.Type))
                .ForMember(dest => dest.TypeName, src => src.MapFrom(x => x.Type.ToString().ToLowerInvariant()))
                .ForMember(dest => dest.Reads, src => src.MapFrom(x => x.Reads));

            CreateMap<Material, MaterialDto>()
                .ForMember(dest => dest.AdditionTime, src => src.MapFrom(x => x.AdditionTime))
                .ForMember(dest => dest.UserId, src => src.MapFrom(x => x.AuthorId))
                .ForMember(dest => dest.UserName, src => src.MapFrom(x => x.Author.UserName))
                .ForMember(dest => dest.Brief, src => src.MapFrom(x => x.Brief))
                .ForMember(dest => dest.CanCommentary, src => src.MapFrom(x => x.CanCommentary))
                .ForMember(dest => dest.CommentsCount, src => src.Ignore())
                .ForMember(dest => dest.Message, src => src.MapFrom(x => x.Message))
                .ForMember(dest => dest.SocialLinks, src => src.MapFrom(x => ContainsSocialLinks(x.Message)))
                .ForMember(dest => dest.CategoryId, src => src.MapFrom(x => x.CategoryId))
                .ForMember(dest => dest.CategoryName, src => src.MapFrom(x => x.Category.Name))
                .ForMember(dest => dest.OnTop, src => src.MapFrom(x => x.OnTop))
                .ForMember(dest => dest.Pending, src => src.MapFrom(x => x.Pending))
                .ForMember(dest => dest.Reads, src => src.MapFrom(x => x.Reads))
                .ForMember(dest => dest.Photo, src => src.MapFrom(x => x.PhotoPath))
                .ForMember(dest => dest.Source, src => src.MapFrom(x => x.Source))
                .ForMember(dest => dest.ShortLink, src => src.MapFrom(x => GetShortUrl(x.Source)))
                .ForMember(dest => dest.Type, src => src.MapFrom(x => x.Type))
                .ForMember(dest => dest.TypeName, src => src.MapFrom(x => x.Type.ToString().ToLowerInvariant()))
                .ForMember(dest => dest.Title, src => src.MapFrom(x => x.Title))
                .ForMember(dest => dest.Tags, src => src.MapFrom(x => BeautifyTags(x.Tags)));

            CreateMap<MaterialDto, Material>()
                .ForMember(dest => dest.AdditionTime, src => src.MapFrom(x => x.AdditionTime))
                .ForMember(dest => dest.AuthorId, src => src.MapFrom(x => x.UserId))
                .ForMember(dest => dest.Brief, src => src.MapFrom(x => x.Brief))
                .ForMember(dest => dest.CanCommentary, src => src.MapFrom(x => x.CanCommentary))
                .ForMember(dest => dest.Comments, src => src.Ignore())
                .ForMember(dest => dest.Message, src => src.MapFrom(x => x.Message))
                .ForMember(dest => dest.CategoryId, src => src.MapFrom(x => x.CategoryId))
                .ForMember(dest => dest.OnTop, src => src.MapFrom(x => x.OnTop))
                .ForMember(dest => dest.Pending, src => src.MapFrom(x => x.Pending))
                .ForMember(dest => dest.PhotoPath, src => src.MapFrom(x => x.Photo))
                .ForMember(dest => dest.PhotoPreview, src => src.MapFrom(x => x.PhotoPreview))
                .ForMember(dest => dest.Reads, src => src.MapFrom(x => x.Reads))
                .ForMember(dest => dest.Source, src => src.MapFrom(x => x.Source))
                .ForMember(dest => dest.Type, src => src.MapFrom(x => x.Type))
                .ForMember(dest => dest.Title, src => src.MapFrom(x => x.Title))
                .ForMember(dest => dest.Tags, src => src.MapFrom(x => BeautifyTags(x.Tags)));
        }

        private string GetShortUrl(string url)
        {
            if (Uri.TryCreate(url, UriKind.Absolute, out var newUri))
            {
                return newUri.Authority;
            }

            return url;
        }

        private bool ContainsSocialLinks(string message)
        {
            return message.Contains("twitter") || message.Contains("tweet") || message.Contains("instagram");
        }

        private string BeautifyTags(string tagsString)
        {
            var tags = tagsString.Split(',').ToList();
            for (var i = 0; i < tags.Count; i++)
            {
                tags[i] = tags[i].Trim();
            }
            return string.Join(", ", tags);
        }
    }
}
