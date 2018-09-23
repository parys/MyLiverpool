using System;
using System.Threading.Tasks;
using AutoMapper;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class ForumMessageService : IForumMessageService
    {
        private readonly IGenericRepository<ForumMessage> _forumMessageRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public ForumMessageService(IGenericRepository<ForumMessage> forumMessageRepository, IMapper mapper, IUserRepository userRepository)
        {
            _forumMessageRepository = forumMessageRepository;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        public async Task<ForumMessageDto> CreateAsync(ForumMessageDto dto)
        {
            var model = _mapper.Map<ForumMessage>(dto);
            model = await _forumMessageRepository.CreateAsync(model);
            model.Author = await _userRepository.GetByIdAsync(model.AuthorId);
            
            return _mapper.Map<ForumMessageDto>(model);
        }

        public async Task<ForumMessageDto> UpdateAsync(ForumMessageDto dto)
        {
            var model = await _forumMessageRepository.GetFirstByPredicateAsync(x => x.Id == dto.Id);
            model.LastModifiedTime = DateTime.Now;
            model.Message = dto.Message;
            await _forumMessageRepository.UpdateAsync(model);
            return _mapper.Map<ForumMessageDto>(model);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await _forumMessageRepository.DeleteAsync(x => x.Id == id);
            return true;
        }
    }
}
