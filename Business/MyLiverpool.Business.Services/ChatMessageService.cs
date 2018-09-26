using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class ChatMessageService : IChatMessageService
    {
        private readonly IGenericRepository<ChatMessage> _chatMessageRepository;
        private readonly IMapper _mapper;

        public ChatMessageService(IMapper mapper, IGenericRepository<ChatMessage> chatMessageRepository)
        {
            _mapper = mapper;
            _chatMessageRepository = chatMessageRepository;
        }
        public async Task<ChatMessageDto> CreateAsync(ChatMessageDto dto)
        {
            dto.AdditionTime = DateTime.Now;
            var model = _mapper.Map<ChatMessage>(dto);
            await _chatMessageRepository.CreateAsync(model);
            model = await _chatMessageRepository.GetFirstByPredicateAsync(x => x.Id == model.Id, true, x => x.Include(c => c.Author));
            return _mapper.Map<ChatMessageDto>(model);
        }

        public Task<ChatMessageDto> UpdateAsync(ChatMessageDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<ChatMessageDto> UpdateAsync(ChatMessageDto dto, int? userId)
        {
            var entity = await _chatMessageRepository.GetFirstByPredicateAsync(x => x.Id == dto.Id, false, x => x.Include(c => c.Author));
            if (userId.HasValue && entity.AuthorId != userId)
            {
                return null;
            }
            entity.Message = dto.Message;
            await _chatMessageRepository.UpdateAsync(entity);
            return _mapper.Map<ChatMessageDto>(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await _chatMessageRepository.DeleteAsync(x => x.Id == id);
            return true;
        }

        public async Task<ChatMessageDto> GetByIdAsync(int id)
        {
            var model = await _chatMessageRepository.GetFirstByPredicateAsync(x => x.Id == id, true, x => x.Include(c => c.Author));
            return _mapper.Map<ChatMessageDto>(model);
        }

        public async Task<IEnumerable<ChatMessageDto>> GetListAsync(int lastMessageId, ChatMessageTypeEnum type)
        {
            Expression<Func<ChatMessage, bool>> filter = x => x.Type == type && x.Id > lastMessageId;
            var messages = await _chatMessageRepository.GetQueryableList(1, GlobalConstants.TakingChatMessagesCount, true, filter,
                SortOrder.Descending, x => x.AdditionTime, c => c.Include(y => y.Author))
                    .ToListAsync();
            return _mapper.Map<IEnumerable<ChatMessageDto>>(messages);
        }
    }
}
