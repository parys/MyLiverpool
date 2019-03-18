using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using MyLfc.Common.Web.Hubs;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class CommentService : ICommentService
    {
        private readonly IMaterialCommentRepository _commentService;
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IEmailSender _messageService;
        private readonly IHttpContextAccessor _accessor;
        private readonly ISignalRHubAggregator _signalRHubAggregator;
        private readonly IHelperService _helperService;

        private const int ItemPerPage = GlobalConstants.CommentsPerPageList * 10 /*todo should be fixed*/;

        public CommentService(IMapper mapper, IMaterialCommentRepository commentService,
            IUserService userService, IHttpContextAccessor accessor,
            IEmailSender messageService, INotificationService notificationService,
            ISignalRHubAggregator signalRHubAggregator, IHelperService helperService)
        {
            _mapper = mapper;
            _commentService = commentService;
            _userService = userService;
            _accessor = accessor;
            _messageService = messageService;
            _notificationService = notificationService;
            _signalRHubAggregator = signalRHubAggregator;
            _helperService = helperService;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var comment = await _commentService.GetByIdAsync(id);
            if (comment.Children.Any())
            {
                foreach (var item in comment.Children)
                {
                    item.Parent = comment.Parent;
                }
                comment.Children.ToList().ForEach(async x => await _commentService.UpdateAsync(x));
            }
            await _commentService.DeleteAsync(id);
            return true;
        }

        public async Task<CommentDto> AddAsync(CommentDto model)
        {
            var comment = _mapper.Map<MaterialComment>(model);
            comment.AdditionTime = comment.LastModified = DateTime.Now;
            comment.Message = await _helperService.SanitizeRudWordsAsync(comment.Message);
            try
            {
                comment = await _commentService.AddAsync(comment);
                var result = _mapper.Map<CommentDto>(comment);
                result.AuthorUserName = await _userService.GetUsernameAsync(comment.AuthorId);
                result.Photo = await _userService.GetPhotoPathAsync(comment.AuthorId);
                if (comment.ParentId.HasValue)
                {
                    await SendNotificationsAsync(comment.ParentId.Value, comment.Id, result.AuthorUserName, comment.Message);
                }
                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<bool> UpdateAsync(CommentDto model)
        {
            var comment = await _commentService.GetByIdAsync(model.Id);
            if (comment == null)
            {
                return false;
            }
            comment.LastModified = DateTime.Now;
            comment.Answer = model.Answer;
            comment.Message = await _helperService.SanitizeRudWordsAsync(model.Message);
            try
            {
                await _commentService.UpdateAsync(comment);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public async Task<PageableData<CommentDto>> GetListAsync(MaterialCommentFiltersDto filters)
        {
            Expression<Func<MaterialComment, bool>> filter = x => true;
            if (filters.OnlyUnverified)
            {
                filter = filter.And(x => !x.IsVerified);
            }
            if (filters.UserId.HasValue)
            {
                filter = filter.And(x => x.AuthorId == filters.UserId.Value);
            }
            var comments = await _commentService.GetOrderedByAsync(filters.Page, filters.ItemsPerPage, filter, SortOrder.Descending, m => m.AdditionTime);

            UpdateCurrentUserField(comments);
            var commentDtos = _mapper.Map<IEnumerable<CommentDto>>(comments);
            var commentsCount = await _commentService.GetCountAsync(filter);
            return new PageableData<CommentDto>(commentDtos, filters.Page, commentsCount, filters.ItemsPerPage);
        }

        public async Task<PageableData<CommentDto>> GetListByMaterialIdAsync(int materialId, int page)
        {
            Expression<Func<MaterialComment, bool>> filter = x => x.MaterialId == materialId;// && x.ParentId == null;

            var comments = await _commentService.GetOrderedByAsync(page, ItemPerPage, filter, SortOrder.Ascending, m => m.AdditionTime);
            UpdateCurrentUserField(comments);
            var unitedComments = UniteComments(comments, page);
            var commentDtos = _mapper.Map<IEnumerable<CommentDto>>(unitedComments);
          //  filter = filter.And(x => x.ParentId == null);//bug need to analize how get all comments for material page but count only top-level for paging
            var commentsCount = await _commentService.GetCountAsync(filter);
            return new PageableData<CommentDto>(commentDtos, page, commentsCount, ItemPerPage);
        }

        public async Task<PageableData<CommentDto>> GetListByMatchIdAsync(int matchId, int page)//todo need to unite with above
        {
            Expression<Func<MaterialComment, bool>> filter = x => x.MatchId == matchId;// && x.ParentId == null;

            var comments = await _commentService.GetOrderedByAsync(page, ItemPerPage, filter, SortOrder.Ascending, m => m.AdditionTime);
            UpdateCurrentUserField(comments);
            var unitedComments = UniteComments(comments, page);
            var commentDtos = _mapper.Map<IEnumerable<CommentDto>>(unitedComments);
          //  filter = filter.And(x => x.ParentId == null);//bug need to analize how get all comments for material page but count only top-level for paging
            var commentsCount = await _commentService.GetCountAsync(filter);
            return new PageableData<CommentDto>(commentDtos, page, commentsCount, ItemPerPage);
        }

        public async Task<int> CountAsync(Expression<Func<MaterialComment, bool>> filter = null)
        {
            return await _commentService.GetCountAsync(filter);
        }

        public async Task<bool> VerifyAsync(int id)
        {
            var comment = await _commentService.GetByIdAsync(id);
            comment.IsVerified = true;
            await _commentService.UpdateAsync(comment);
            return true;
        }

        public async Task<bool> UpdateVoteAsync(CommentVoteDto dto)
        {
            var vote = await _commentService.GetVoteByIdAsync(dto.CommentId, dto.UserId);
            if (vote != null)
            {
                vote.Positive = dto.Positive;
                await _commentService.UpdateVoteAsync(vote);
            }
            else
            {
                var comment = await _commentService.GetByIdAsync(dto.CommentId);
                if (comment.AuthorId == dto.UserId)
                {
                    return false;
                }
                vote = _mapper.Map<CommentVote>(dto);
                await _commentService.AddVoteAsync(vote);
            }
            return true;
        }

        public async Task<IEnumerable<CommentDto>> GetLastListAsync()
        {
            var comments = await _commentService.GetLastAsync(GlobalConstants.LastCommentsCount, SortOrder.Descending, m => m.AdditionTime);
            foreach (var comment in comments)
            {
                comment.Message = Regex.Replace(Regex.Replace(comment.Message, "&.*?;", string.Empty), "<.*?>", string.Empty);
                if (comment.Message.Length > GlobalConstants.LastCommentMessageSymbolCount)
                    comment.Message = comment.Message.Substring(0, GlobalConstants.LastCommentMessageSymbolCount) +
                                      "...";
            }
            return _mapper.Map<IEnumerable<CommentDto>>(comments.Where(x => !string.IsNullOrWhiteSpace(x.Message)));
        }

        private async Task SendNotificationsAsync(int parentCommentId, int commentId, string authorUserName, string commentText)
        {
            var parentComment = await _commentService.GetByIdAsync(parentCommentId);
            var userConfig = await _userService.GetUserConfigAsync(parentComment.AuthorId);
            if (userConfig.IsReplyToPmEnabled)
            {
                await SendNotificationAsync(parentComment, commentId, authorUserName, commentText);
            }
            if (userConfig.IsReplyToEmailEnabled)
            {
                await SendNotificationToEmailAsync(parentComment, commentId, authorUserName, commentText);
            }
        }

        private void UpdateCurrentUserField(ICollection<MaterialComment> comments)
        {
            if (_accessor.HttpContext.User.Identity.IsAuthenticated)
            {
                foreach (var materialComment in comments)
                {
                    materialComment.CurrentUserId = _accessor.HttpContext.User.GetUserId(); //todo need more elegant solution
                }
            }
        }

        private static IEnumerable<MaterialComment> UniteComments(ICollection<MaterialComment> comments, int page)
        {
            var startNumber = ItemPerPage * (page - 1) + 1;
            foreach (var comment in comments)
            {
                comment.Number = startNumber++;
                if (comment.ParentId == null)
                {
                    continue;
                }
                var parent = comments.FirstOrDefault(c => c.OldId == comment.OldParentId || c.Id == comment.ParentId);
                if (parent != null)
                {
                    if (parent.Children == null)
                    {
                        parent.Children = new List<MaterialComment>();
                    }
                    parent.Children.Add(comment);
                }
            }
            return comments.Where(c => c.ParentId == null);
        }

        private async Task SendNotificationAsync(MaterialComment parentComment, int commentId, string authorUserName, string commentText)
        {
            var notification = new NotificationDto
            {
                DateTime = DateTimeOffset.Now,
                UserId = parentComment.AuthorId,
                Type = (NotificationType)parentComment.Type,
                EntityId = parentComment.MaterialId ?? parentComment.MatchId,
                IsRead = false,
                CommentId = commentId,
                Text = $"Пользователь {authorUserName} оставил ответ на ваш комментарий: \"{commentText}\"."
            };
            var notificationDto = await _notificationService.CreateAsync(notification);
            _signalRHubAggregator.SendToUser(HubEndpointConstants.NewNotifyEndpoint, notificationDto, parentComment.AuthorId);
        }

        private async Task SendNotificationToEmailAsync(MaterialComment parentComment, int commentId, string authorUserName, string commentText)
        {
            const string newAnswer = "Новый ответ на ваш комментарий";
            var user = await _userService.GetUserAsync(parentComment.AuthorId);
            if (user != null)
            {
                await _messageService.SendEmailAsync(user.Email, newAnswer, GetNotificationEmailBody(parentComment, commentId, authorUserName, commentText));
            }
        }

        private string GetNotificationEmailBody(MaterialComment parentComment, int commentId, string authorUserName, string commentText)
        {
            var host = _accessor.HttpContext.Request.Host;

            var link = parentComment.Type.ToString().ToLowerInvariant();

            var callbackUrl = $"https://{host}/{link}/{parentComment.MaterialId ?? parentComment.MatchId}#com{commentId}";
            return $"Пользователь {authorUserName} оставил <a href=\"{callbackUrl}\">ответ</a> на ваш комментарий: \"{commentText}\".";
        }

    }
}
