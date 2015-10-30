﻿using AutoMapper;
using MyLiverpoolSite.Business.ViewModels.News;
using MyLiverpoolSite.Data.Entities;

namespace MyLiverpoolSite.Business.Services
{
    public class AutoMapperBindings : Profile
    {
        public new static void Configure()
        {
            RegisterNewsMapping();
            RegisterUserMapping();
        }

        private static void RegisterUserMapping()
        {
           // Mapper.CreateMap<CreateUserViewModel, User>()
        //    .ForMember(t => t.Id, opt => opt.MapFrom(m => m.Id))
        //    .ForMember(t => t.Login, opt => opt.MapFrom(m => m.Login))
        //    .ForMember(t => t.Password, opt => opt.MapFrom(m => m.Password))
        //    .ForMember(t => t.Email, opt => opt.MapFrom(m => m.Email))
        //    .ForMember(t => t.Birthday, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.City, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.Comments, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.Country, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.ForumMessages, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.FullName, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.Gender, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.Homepage, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.Ip, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.LastModifiedUtc, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.OldId, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.PhotoPath, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.RegistrationDateUtc, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.Skype, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.Title, opt => opt.Ignore())//MapFrom(m => m.Email))
        //    .ForMember(t => t.Verify, opt => opt.Ignore())//MapFrom(m => m.Email))

            //    ;
            //    //.ForMember(t => t.NewsCategories, opt => opt.Ignore())

            //    Mapper.CreateMap<User, CreateUserViewModel>()
            //        // .ForMember(t => t.ConfirmPassword, opt => opt.Ignore())// MapFrom(m => m.))
            //        .ForMember(t => t.ConfirmPassword, opt => opt.Ignore());// MapFrom(m => m.))
        }

        private static void RegisterNewsMapping()
        {
                Mapper.CreateMap<CreateEditNewsViewModel, NewsItem>()
                    .ForMember(t => t.Id, opt => opt.MapFrom(m => m.Id))
                    .ForMember(t => t.Title, opt => opt.MapFrom(m => m.Title))
                    .ForMember(t => t.Brief, opt => opt.MapFrom(m => m.Brief))
                    .ForMember(t => t.Message, opt => opt.MapFrom(m => m.Message))
                    .ForMember(t => t.NewsCategory, opt => opt.MapFrom(m => m.NewsCategory))
            //        .ForMember(t => t.OnTop, opt => opt.MapFrom(m => m.OnTop))
                    .ForMember(t => t.CanCommentary, opt => opt.MapFrom(m => m.CanCommentary))
            //        .ForMember(t => t.Pending, opt => opt.MapFrom(m => m.Pending))
                    .ForMember(t => t.Source, opt => opt.MapFrom(m => m.Source))
                    .ForMember(t => t.AdditionTime, opt => opt.Ignore())//MapFrom(m => m.));
                    .ForMember(t => t.Comments, opt => opt.Ignore())//MapFrom(m => m.));
            //        .ForMember(t => t.Day, opt => opt.Ignore())//MapFrom(m => m.));
            //        .ForMember(t => t.LastModifiedUtc, opt => opt.Ignore())//MapFrom(m => m.));
            //        .ForMember(t => t.Month, opt => opt.Ignore())//MapFrom(m => m.));
                    .ForMember(t => t.NumberCommentaries, opt => opt.Ignore())//MapFrom(m => m.));
            //        .ForMember(t => t.OldId, opt => opt.Ignore())//MapFrom(m => m.));
                    .ForMember(t => t.PhotoPath, opt => opt.Ignore())//MapFrom(m => m.));
            //        .ForMember(t => t.Rating, opt => opt.Ignore())//MapFrom(m => m.));
            //        .ForMember(t => t.RatingNumbers, opt => opt.Ignore())//MapFrom(m => m.));
            //        .ForMember(t => t.RatingSumm, opt => opt.Ignore())//MapFrom(m => m.));
                    .ForMember(t => t.Reads, opt => opt.Ignore())//MapFrom(m => m.));
            //        .ForMember(t => t.User, opt => opt.Ignore())//MapFrom(m => m.));
            //        .ForMember(t => t.Year, opt => opt.Ignore())//MapFrom(m => m.));
            //        .ForMember(t => t.CategoryId, opt => opt.Ignore())
            ;//MapFrom(m => m.));

                Mapper.CreateMap<NewsItem, CreateEditNewsViewModel>()
                    //.ForMember(t => t.NewsCategories, opt => opt.Ignore())
                    .ForMember(t => t.NewsCategories, opt => opt.Ignore());
        }
    }
}
