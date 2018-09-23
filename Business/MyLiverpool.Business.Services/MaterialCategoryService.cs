using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class MaterialCategoryService : IMaterialCategoryService
    {
        private readonly IGenericRepository<MaterialCategory> _categoryRepository;
        private readonly IMapper _mapper;

        public MaterialCategoryService(IGenericRepository<MaterialCategory> categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<ICollection<MaterialCategoryDto>> GetListAsync(MaterialType materialType)
        {
            var categories = await _categoryRepository
                .GetQueryableList(filter: x => x.MaterialType == materialType)
                .Select(x => new MaterialCategory
                {
                    Id = x.Id,
                    Description = x.Description,
                    ItemsCount = x.Materials.Count,
                    Name = x.Name,
                    MaterialType = x.MaterialType,
                    OldId = x.OldId
                }).ToListAsync();
            var result = _mapper.Map<ICollection<MaterialCategoryDto>>(categories.OrderBy(x => x.Name));
            return result;
        }

        public async Task<MaterialCategoryDto> GetAsync(int id)
        {
            var result = await _categoryRepository.GetQueryableList()
                .Select(x => new MaterialCategory
                {
                    Id = x.Id,
                    OldId = x.OldId,
                    Description = x.Description,
                    ItemsCount = x.Materials.Count,
                    Name = x.Name,
                    MaterialType = x.MaterialType
                }).FirstOrDefaultAsync(x => x.Id == id);
            return _mapper.Map<MaterialCategoryDto>(result);
        }

        public async Task<MaterialCategoryDto> CreateAsync(MaterialCategoryDto dto)
        {
            var model = _mapper.Map<MaterialCategory>(dto);
            model = await _categoryRepository.CreateAsync(model);
            var result = _mapper.Map<MaterialCategoryDto>(model);
            return result;
        }

        public async Task<MaterialCategoryDto> UpdateAsync(MaterialCategoryDto dto)
        {
            var model = await _categoryRepository.GetFirstByPredicateAsync(x => x.Id == dto.Id);
            model.Name = dto.Name;
            model.Description = dto.Description;
            await _categoryRepository.UpdateAsync(model);
            var result = _mapper.Map<MaterialCategoryDto>(model);
            return result;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _categoryRepository.GetFirstByPredicateAsync(x => x.Id == id);
            if (category.Materials.Count > 0)
            {
                return false;
            }
            await _categoryRepository.DeleteAsync(x => x.Id == id);
            return true;
        }
    }
}
