using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Data.Entities;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class WishService : IWishService
    {
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailService;
        private readonly IGenericRepository<Wish> _wishRepository;

        public WishService(IMapper mapper, IEmailSender emailService, IGenericRepository<Wish> wishRepository)
        {
            _mapper = mapper;
            _emailService = emailService;
            _wishRepository = wishRepository;
        }

        public async Task<WishDto> CreateAsync(WishDto dto)
        {
            var wish = _mapper.Map<Wish>(dto);
            wish = await _wishRepository.CreateAsync(wish);
            await SendAlertAsync(wish.Message);
            return _mapper.Map<WishDto>(wish);
        }

        public async Task<PageableData<WishDto>> GetListAsync(int page, int? typeId = null, string filterText = null)
        {
            Expression<Func<Wish, bool>> filter = x => true;
            //  if (typeId.HasValue)//bug temporary stateId = 1 or 0
            {
                filter = filter.And(x => (int)x.State == 1 || x.State == 0);
               // filter = filter.And(x => (int)x.Type == typeId.Value);
            }
            if (!string.IsNullOrWhiteSpace(filterText) && filterText != "undefined")
            {
                filter = filter.And(x => x.Title.Contains(filterText) || x.Message.Contains(filterText));
            }
            var wishes = await _wishRepository.GetListAsync(page, filter : filter, order: SortOrder.Descending, orderBy: x => x.Id);
            var wishesDto = _mapper.Map<IEnumerable<WishDto>>(wishes);
            var wishesCount = await _wishRepository.CountAsync(filter);
            return new PageableData<WishDto>(wishesDto, page, wishesCount);
        }

        public async Task<PageableData<WishDto>> GetListAsync(WishFiltersDto filters)
        {
            Expression<Func<Wish, bool>> filter = x => true;
            filter = filter.And(x => (int)x.State == 1 || x.State == 0);

            if (!string.IsNullOrWhiteSpace(filters.FilterText) && filters.FilterText != "undefined")
            {
                filter = filter.And(x => x.Title.Contains(filters.FilterText) || x.Message.Contains(filters.FilterText));
            }
            var wishes = await _wishRepository.GetListAsync(filters.Page, filter: filter, order: SortOrder.Descending, orderBy: x => x.Id);

            var wishesDto = _mapper.Map<IEnumerable<WishDto>>(wishes);
            var wishesCount = await _wishRepository.CountAsync(filter);
            return new PageableData<WishDto>(wishesDto, filters.Page, wishesCount);
        }

        public async Task<WishDto> GetAsync(int wishId)
        {
            var wish = await _wishRepository.GetFirstByPredicateAsync(x => x.Id == wishId);
            return _mapper.Map<WishDto>(wish);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await _wishRepository.DeleteAsync(x => x.Id == id);
            return true;
        }

        public async Task<WishDto> UpdateAsync(WishDto dto)
        {
            var wish = await _wishRepository.GetFirstByPredicateAsync(x => x.Id == dto.Id);
            if (wish != null)
            {
                wish.State = (WishStateEnum) dto.State;
                wish.Message = dto.Message;
                wish.Title = dto.Title;
                wish.Type = (WishType) dto.Type;
                await _wishRepository.UpdateAsync(wish);
            }
            return wish != null ? _mapper.Map<WishDto>(wish) : null;
        }

        private async Task SendAlertAsync(string message)
        {
            try
            {
                await _emailService.SendEmailAsync("Новое пожелание", message);
            }
            catch{} // think what to do
        }
    }
}
