using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyLfc.Common.Web.Hubs;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class PmService : IPmService
    {
        private readonly IGenericRepository<PrivateMessage> _pmRepository;
        private readonly IEmailSender _messageService;
        private readonly ISignalRHubAggregator _signalRHub;
        private readonly IMapper _mapper;

        public PmService(IGenericRepository<PrivateMessage> pmRepository, IMapper mapper, IEmailSender messageService, ISignalRHubAggregator signalRHub)
        {
            _pmRepository = pmRepository;
            _mapper = mapper;
            _messageService = messageService;
            _signalRHub = signalRHub;
        }

        public async Task<PrivateMessagesDto> GetListAsync(int id)
        {
            var messages = await _pmRepository.GetListAsync(filter: x => x.ReceiverId == id || x.SenderId == id,
                order: SortOrder.Ascending,
                orderBy:x => x.SentTime,
                include: p => p.Include(x => x.Receiver).Include(y => y.Sender));
            var dto = new PrivateMessagesDto
            {
                Received = _mapper.Map<ICollection<PrivateMessageMiniDto>>(messages.Where(x => x.ReceiverId == id).OrderByDescending(x => x.SentTime)),
                Sent = _mapper.Map<ICollection<PrivateMessageMiniDto>>(messages.Where(x => x.SenderId == id).OrderByDescending(x => x.SentTime))
            };
            return dto;
        }

        public async Task<PrivateMessageDto> GetAsync(int messageId, int userId)
        {
            var message = await _pmRepository.GetFirstByPredicateAsync(x => x.Id == messageId, false, 
                x => x.Include(m => m.Receiver)
                    .Include(m => m.Sender));
            if (message == null || message.ReceiverId != userId && message.SenderId != userId)
            {
                throw new UnauthorizedAccessException();
            }

            if (!message.IsRead && message.ReceiverId == userId)
            {
                message.IsRead = true;
                await _pmRepository.UpdateAsync(message);
                _signalRHub.SendToUser(HubEndpointConstants.PmReadEndpoint, true, userId);
            }

            var result = _mapper.Map<PrivateMessageDto>(message);
            return result;
        }

        public async Task<PrivateMessageDto> SaveAsync(PrivateMessageDto model)
        {
            await RemoveOldMessagesAsync(model.SenderId);
            await RemoveOldMessagesAsync(model.ReceiverId);

            var message = _mapper.Map<PrivateMessage>(model);
            message.SentTime = DateTime.Now;
            try
            {
                message = await _pmRepository.CreateAsync(message);
                await _messageService.SendNewPmToEmailAsync(message.ReceiverId, message.Message, message.Id);
                return _mapper.Map<PrivateMessageDto>(message);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<int> GetUnreadPmCountAsync(int userId)
        {
             return await _pmRepository.CountAsync(x => !x.IsRead && x.ReceiverId == userId);
        }

        private async Task RemoveOldMessagesAsync(int userId)
        {
            var countUserMessages = await _pmRepository.CountAsync(x => x.ReceiverId == userId || x.SenderId == userId);
            if (countUserMessages > GlobalConstants.PmsPerUser)
            {
                var messages =
                    await _pmRepository.GetListAsync(asNoTracking: false, filter: x => x.ReceiverId == userId || x.SenderId == userId);
                await _pmRepository.DeleteRangeAsync(messages.Take(GlobalConstants.PmsPerUser / 2).ToList());
            }
        }
    }
}
