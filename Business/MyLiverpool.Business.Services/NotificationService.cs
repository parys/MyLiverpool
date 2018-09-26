using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MyLfc.Common.Web.Hubs;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IGenericRepository<Notification> _notificationRepository;
        private readonly ISignalRHubAggregator _signalRHubAggregator;
        private readonly IMapper _mapper;

        public NotificationService(IGenericRepository<Notification> notificationRepository, IMapper mapper, ISignalRHubAggregator signalRHubAggregator)
        {
            _notificationRepository = notificationRepository;
            _mapper = mapper;
            _signalRHubAggregator = signalRHubAggregator;
        }

        public async Task<NotificationDto> CreateAsync(NotificationDto dto)
        {
            await RemoveOldNotificationsAsync(dto.UserId);
            var model = _mapper.Map<Notification>(dto);
            model = await _notificationRepository.CreateAsync(model);
            return _mapper.Map<NotificationDto>(model);
        }

        public Task<NotificationDto> UpdateAsync(NotificationDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _notificationRepository.DeleteAsync(x => x.Id == id);
        }

        public Task<NotificationDto> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _notificationRepository.CountAsync(x => x.UserId == userId && !x.IsRead);
        }

        public async Task<IEnumerable<NotificationDto>> GetListAsync(int userId)
        {
            var list = await _notificationRepository.GetListAsync(filter: x => x.UserId == userId, order: SortOrder.Descending,
                orderBy: y => y.DateTime);
            return _mapper.Map<IEnumerable<NotificationDto>>(list);
        }

        public async Task<bool> MarkAsReadAsync(int[] ids, int userId)
        {
            var entities =
                (await _notificationRepository.GetListAsync(filter: x => ids.Contains(x.Id) && !x.IsRead && x.UserId == userId))
                .ToList();
            entities.ForEach(x =>x.IsRead = true);
            await _notificationRepository.UpdateRangeAsync(entities);
            _signalRHubAggregator.SendToUser(HubEndpointConstants.NotifyReadEndpoint, entities.Count, userId);
            return true;
        }

        private async Task RemoveOldNotificationsAsync(int userId)
        {
            var count = await _notificationRepository.CountAsync(x => x.UserId == userId);
            if (count >= GlobalConstants.NotificationsCount)
            {
                var list = await _notificationRepository.GetListAsync(filter: x => x.IsRead);
                foreach (var notification in list)
                {
                    await DeleteAsync(notification.Id);
                }
            }
        }
    }
}
