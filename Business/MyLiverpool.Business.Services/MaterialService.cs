using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
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
    public class MaterialService : IMaterialService
    {
        private readonly IMaterialRepository _materialRepository;
        private readonly IMaterialCommentRepository _materialCommentRepository;
        private readonly IMapper _mapper;

        public MaterialService(IMaterialRepository materialRepository, IMapper mapper, IMaterialCommentRepository materialCommentRepository)
        {
            _materialRepository = materialRepository;
            _mapper = mapper;
            _materialCommentRepository = materialCommentRepository;
        }

        #region Dto 
        
        public async Task<PageableData<MaterialMiniDto>> GetDtoAllAsync(MaterialFiltersDto filters)
        {
            Expression<Func<Material, bool>> filter = x => true;
            if (!filters.IsInNewsmakerRole)
            {
                filter = filter.And(x => !x.Pending);
            }
            
            if (filters.CategoryId.HasValue)
            {
                filter = filter.And(x => x.CategoryId == filters.CategoryId.Value);
            }
            else
            {
                if (filters.MaterialType != MaterialType.Both)
                {
                    filter = filter.And(x => x.Type == filters.MaterialType);
                }
            }
            if (filters.UserId.HasValue)
            {
                filter = filter.And(x => x.AuthorId == filters.UserId.Value);
            }
            else if (!string.IsNullOrWhiteSpace(filters.UserName))
            {
                Expression<Func<Material, bool>> newFilter = x => x.Author.UserName.Contains(filters.UserName);
                filter = filter.And(newFilter);
            }

            ICollection<Material> topNews = new List<Material>();
            if (filters.Page == GlobalConstants.FirstPage)
            {
                topNews = await _materialRepository.GetTopMaterialsAsync(filter);
            }

            var allNewsCount = await _materialRepository.GetCountAsync(filter);
            
            var news =
                await
                    _materialRepository.GetOrderedByDescAndNotTopAsync(filters.Page, filters.ItemsPerPage, filter,
                        x => x.AdditionTime);
            var newsForView = topNews.Concat(news.OrderByDescending(x => x.AdditionTime));//bug need to research why need to order one more time
            var newsDtos = _mapper.Map<IEnumerable<MaterialMiniDto>>(newsForView);
            var result = new PageableData<MaterialMiniDto>(newsDtos, filters.Page, allNewsCount);
            return result;
        }

        public async Task<MaterialDto> GetDtoAsync(int id, bool hasAccess = false)
        {
            var material = await _materialRepository.GetByIdAsync(id);
            if (material == null)
            {
                return null;
            }
            
            var dto = _mapper.Map<MaterialDto>(material);
            var previous = await GetPrevMaterialAsync(dto.Id, dto.OnTop, hasAccess);
            var next = await GetNextMaterialAsync(dto.Id, dto.OnTop, hasAccess);
            dto.PrevMaterialId = previous?.Id;
            dto.PrevMaterialTitle = previous?.Title;
            dto.NextMaterialId = next?.Id;
            dto.NextMaterialTitle = next?.Title;
           return dto;
        }

        public async Task<bool> DeleteAsync(int id, ClaimsPrincipal claims)
        {
            var material = await _materialRepository.GetByIdAsync(id);

            if ((!claims.IsInRole(nameof(RolesEnum.NewsFull)) && material.Type == MaterialType.News) ||
                (!claims.IsInRole(nameof(RolesEnum.BlogFull)) && material.Type == MaterialType.Blogs))
            {
                return false;
            }
            try
            {
                var comments = material.Comments.ToList();
                foreach (var comment in comments)
                {
                    await _materialCommentRepository.DeleteAsync(comment);
                }
                await _materialRepository.DeleteAsync(material);
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public async Task<MaterialDto> ActivateAsync(int id, ClaimsPrincipal claims)
        {
            var material = await _materialRepository.GetByIdAsync(id);
            if (material == null)
            {
                return null;
            }

            if ((!claims.IsInRole(nameof(RolesEnum.NewsFull)) && material.Type == MaterialType.News) ||
                (!claims.IsInRole(nameof(RolesEnum.BlogFull)) && material.Type == MaterialType.Blogs))
            {
                return null;
            }

                material.Pending = false;
            await _materialRepository.UpdateAsync(material);
            return _mapper.Map<MaterialDto>(material);
        }

        public async Task<MaterialDto> CreateAsync(MaterialDto model, int userId)
        {
            model.AdditionTime = DateTime.Now;
            model.UserId = userId;

            var material = _mapper.Map<Material>(model);
            material.LastModified = DateTime.Now;

            try
            {
                material = await _materialRepository.AddAsync(material);
                return _mapper.Map<MaterialDto>(material);
            }
            catch (Exception)
            {
            }
            return null;
        }

        public async Task<MaterialDto> EditAsync(MaterialDto model)
        {
            var updatingItem = await _materialRepository.GetByIdAsync(model.Id);
            updatingItem.LastModified = DateTime.Now;
            updatingItem.Brief = model.Brief;
            updatingItem.Title = model.Title;
            updatingItem.Message = model.Message;
            updatingItem.CanCommentary = model.CanCommentary;
            updatingItem.OnTop = model.OnTop;
            updatingItem.Pending = model.Pending;
            updatingItem.PhotoPath = model.Photo;
            updatingItem.PhotoPreview = model.PhotoPreview;
            updatingItem.Source = model.Source;
            updatingItem.Category = null;
            updatingItem.CategoryId = model.CategoryId;
            updatingItem.UsePhotoInBody = model.UsePhotoInBody;
            updatingItem.Tags = model.Tags;

            try
            {
                await _materialRepository.UpdateAsync(updatingItem);
                return _mapper.Map<MaterialDto>(updatingItem);
            }
            catch (Exception)
            {}
            return null;
        }

        public async Task AddViewAsync(int id)
        {
            var item = await _materialRepository.GetByIdAsync(id);
            item.Reads += 1;
            await _materialRepository.UpdateAsync(item);
        }

        private const string XpathImages = "//img[contains(@class, 'media-gallery-image')]";
        public async Task<IEnumerable<string>> GetExtractedImageLinks(string url)
        {
            if (!url.Contains("://"))
            {
                url = url.Replace(":/", "://");
            }

            if (url.Last() == '/')
            {
                url = url.Substring(0, url.Length - 1);
            }
            var htmlImgTags = await HtmlExtractorHelpers.GetHtmlRowsAsync(url, XpathImages);
            return htmlImgTags?.Select(x => x.Attributes["data-src"].Value);
        }

        #endregion

        private async Task<Material> GetPrevMaterialAsync(int nextMaterialId, bool nextOnTop, bool hasAccess)
        {
            Expression<Func<Material, bool>> filter;
            if (hasAccess)
            {
                filter = x => true;
            }
            else
            {
                filter = x => !x.Pending;
            }
            if (nextOnTop)
            {
                var topMaterials = await _materialRepository.GetTopMaterialsAsync(filter);
                if (topMaterials.Count > 1 && topMaterials.Last().Id != nextMaterialId)
                {
                    return topMaterials.OrderByDescending(x => x.AdditionTime).TakeWhile(x => x.Id != nextMaterialId)
                        .LastOrDefault();
                }
            }

            Material material = null;
            nextMaterialId -= 1;
            while (material == null && nextMaterialId > 0 || (material == null || material.Pending) && !hasAccess)
            {
                material = await _materialRepository.GetByIdAsync(nextMaterialId--);
            }
            return material;
        }

        private async Task<Material> GetNextMaterialAsync(int prevMaterialId, bool prevOnTop, bool hasAccess)
        {
            Expression<Func<Material, bool>> filter;
            if (hasAccess)
            {
                filter = x => true;
            }
            else
            {
                filter = x => !x.Pending;
            }
            if (prevOnTop)
            {
                var topMaterials = await _materialRepository.GetTopMaterialsAsync(filter);
                if (topMaterials.Count > 1 && topMaterials.First().Id != prevMaterialId)
                {
                    return topMaterials.TakeWhile(x => x.Id != prevMaterialId)
                        .LastOrDefault();
                }

                return null;
            }
            var lastMaterial = await _materialRepository.GetOrderedByAsync(1, 1, SortOrder.Descending, orderBy: x=> x.AdditionTime);
            Material material = null;
            prevMaterialId += 1;
            while (material == null && prevMaterialId <= lastMaterial.FirstOrDefault()?.Id)
            {
                material = await _materialRepository.GetByIdAsync(prevMaterialId++);
                if (material != null && material.Pending && !hasAccess)
                {
                    material = null;
                }
            }
            if (material == null)
            {
                var topMaterials = await _materialRepository.GetTopMaterialsAsync(filter);
                material = topMaterials.LastOrDefault();
            }
            return material;
        }
    }
}
