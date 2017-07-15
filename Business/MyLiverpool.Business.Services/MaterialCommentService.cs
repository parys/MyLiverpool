﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
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
    public class MaterialCommentService : IMaterialCommentService
    {
        private readonly IMaterialCommentRepository _commentService;
        private readonly IMaterialService _materialService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IPmService _pmService;
        private readonly IEmailSender _messageService;
        private readonly IHttpContextAccessor _accessor;

        private const int ItemPerPage = GlobalConstants.CommentsPerPageList;

        public MaterialCommentService(IMapper mapper, IMaterialCommentRepository commentService,
            IUserService userService, IPmService pmService, IHttpContextAccessor accessor, IEmailSender messageService, IMaterialService materialService)
        {
            _mapper = mapper;
            _commentService = commentService;
            _userService = userService;
            _pmService = pmService;
            _accessor = accessor;
            _messageService = messageService;
            _materialService = materialService;
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
                comment.Children.ToList().ForEach(x => _commentService.Update(x));
            }
            await _commentService.DeleteAsync(id);
            await _commentService.SaveChangesAsync();
            return true;
        }

        public async Task<MaterialCommentDto> AddAsync(MaterialCommentDto model)
        {
            var comment = _mapper.Map<MaterialComment>(model);
            comment.MaterialType = (await _materialService.GetDtoAsync(model.MaterialId, true)).Type;
            comment.AdditionTime = DateTime.Now;
            comment.LastModified = DateTime.Now;
            try
            {
                comment = await _commentService.AddAsync(comment);
                await _commentService.SaveChangesAsync();
                var result = _mapper.Map<MaterialCommentDto>(comment);
                result.AuthorUserName = await _userService.GetUsernameAsync(comment.AuthorId);
                result.Photo = await _userService.GetPhotoPathAsync(comment.AuthorId);
                if (comment.ParentId.HasValue)
                {
                    await SendNotificationsAsync(comment.ParentId.Value);
                }
                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<bool> UpdateAsync(MaterialCommentDto model)
        {
            var comment = await _commentService.GetByIdAsync(model.Id);
            if (comment == null)
            {
                return false;
            }
            comment.LastModified = DateTime.Now;
            comment.Answer = model.Answer;
            comment.Message = model.Message;
            comment.IsVerified = model.IsVerified;
            try
            {
                _commentService.Update(comment);
                await _commentService.SaveChangesAsync();
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public async Task<PageableData<MaterialCommentDto>> GetListAsync(MaterialCommentFiltersDto filters)
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
            var comments = await _commentService.GetOrderedByAsync(filters.Page, ItemPerPage, filter, SortOrder.Descending, m => m.AdditionTime);

            UpdateCurrentUserField(comments);
            var commentDtos = _mapper.Map<IEnumerable<MaterialCommentDto>>(comments);
            var commentsCount = await _commentService.GetCountAsync(filter);
            return new PageableData<MaterialCommentDto>(commentDtos, filters.Page, commentsCount, GlobalConstants.CommentsPerPageList);
        }

        public async Task<PageableData<MaterialCommentDto>> GetListByMaterialIdAsync(int materialId, int page)
        {
            Expression<Func<MaterialComment, bool>> filter = x => x.MaterialId == materialId;// && x.ParentId == null;

            var comments = await _commentService.GetOrderedByAsync(page, ItemPerPage, filter, SortOrder.Ascending, m => m.AdditionTime);
            UpdateCurrentUserField(comments);
            var unitedComments = UniteComments(comments, page);
            var commentDtos = _mapper.Map<IEnumerable<MaterialCommentDto>>(unitedComments);
          //  filter = filter.And(x => x.ParentId == null);//bug need to analize how get all comments for material page but count only top-level for paging
            var commentsCount = await _commentService.GetCountAsync(filter);
            return new PageableData<MaterialCommentDto>(commentDtos, page, commentsCount, ItemPerPage);
        }

        public async Task<bool> VerifyAsync(int id)
        {
            var comment = await _commentService.GetByIdAsync(id);
            comment.IsVerified = true;
            comment.LastModified = DateTime.Now;
            _commentService.Update(comment);
            await _commentService.SaveChangesAsync();
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

        public async Task<IEnumerable<MaterialCommentDto>> GetLastListAsync()
        {
            var comments = await _commentService.GetLastAsync(GlobalConstants.LastCommentsCount, SortOrder.Descending, m => m.AdditionTime);
            foreach (var comment in comments)
            {
                comment.Message = Regex.Replace(comment.Message.Replace("&nbsp;", ""), "<.*?>", string.Empty);
                if (comment.Message.Length > GlobalConstants.LastCommentMessageSymbolCount)
                    comment.Message = comment.Message.Substring(0, GlobalConstants.LastCommentMessageSymbolCount) +
                                      "...";
            }
            return _mapper.Map<IEnumerable<MaterialCommentDto>>(comments);
        }

        private async Task SendNotificationsAsync(int parentCommentId)
        {
            var parentComment = await _commentService.GetByIdAsync(parentCommentId);
            var userConfig = await _userService.GetUserConfigAsync(parentComment.AuthorId);
            if (userConfig.IsReplyToPmEnabled)
            {
                await SendNotificationToPmAsync(parentComment);
            }
            if (userConfig.IsReplyToEmailEnabled)
            {
                await SendNotificationToEmailAsync(parentComment);
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

        private async Task SendNotificationToPmAsync(MaterialComment parentComment)
        {
            var link = parentComment.MaterialType == MaterialType.News ? "news" : "blogs";
            var pmDto = new PrivateMessageDto
            {
                SenderId = GlobalConstants.MyLfcUserId,
                ReceiverId = parentComment.AuthorId,
                SentTime = DateTimeOffset.Now,
                Title = "Новый ответ",
                Message = $"На ваш комментарий получен ответ.[{link};{parentComment.MaterialId}]"
            };
            await _pmService.SaveAsync(pmDto);
        }

        private async Task SendNotificationToEmailAsync(MaterialComment parentComment)
        {
            const string newAnswer = "Новый ответ";
            var user = await _userService.GetUserAsync(parentComment.AuthorId);
            if (user != null)
            {
                await _messageService.SendEmailAsync(user.Email, newAnswer, GetNotificationEmailBody(parentComment));
            }
        }

        private string GetNotificationEmailBody(MaterialComment parentComment)
        {
            var host = _accessor.HttpContext.Request.Host;
            var link = parentComment.MaterialType == MaterialType.News ? "news" : "blogs";

            var callbackUrl = $"http://{host}/{link}/{parentComment.MaterialId}";
            return $"На ваш комментарий получен ответ, <a href=\"{callbackUrl}\">перейти к материалу</a>.";
        }

    }
}
