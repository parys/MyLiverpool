using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MyLiverpool.Data.Entities;
using Microsoft.EntityFrameworkCore;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Data.ResourceAccess.Repositories
{
    public class MaterialRepository : IMaterialRepository
    {
        private readonly LiverpoolContext _context;

        public MaterialRepository(LiverpoolContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Material>> GetAsync()
        {
            return await _context.Materials.ToListAsync();
        }

        public async Task<Material> GetByIdAsync(int id)
        {
            return await _context.Materials
                .Include(x => x.Category)
                .Include(x => x.Author)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Material> AddAsync(Material entity)
        {
            var addedEntity = await _context.Materials.AddAsync(entity);
            await _context.SaveChangesAsync();
            return addedEntity.Entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Materials.FindAsync(id);
            if (entity != null)
            {
                await DeleteAsync(entity);
            }
        }

        public async Task DeleteAsync(Material entity)
        {
            if (_context.Entry(entity).State == EntityState.Detached)
            {
                _context.Materials.Attach(entity);
            }

            _context.Materials.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Material entity)
        {
            _context.Materials.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<ICollection<Material>> GetTopMaterialsAsync(Expression<Func<Material, bool>> filter = null)
        {
            return await _context.Materials
                .Include(x => x.Category)
                .Include(x => x.Author)
                .Where(filter)
                .Where(x => x.OnTop)
                .Select(x => new Material()
                {
                    Type = x.Type,
                    Id = x.Id,
                    OnTop = x.OnTop,
                    LastModified = x.LastModified,
                    Author = x.Author,
                    AdditionTime = x.AdditionTime,
                    AuthorId = x.AuthorId,
                    Brief = x.Brief,
                    CanCommentary = x.CanCommentary,
                    Category = x.Category,
                    CategoryId = x.CategoryId,
                    Message = x.Message,
                    CommentsCount = x.Comments.Count,
                    OldId = x.OldId,
                    Pending = x.Pending,
                    PhotoPath = x.PhotoPath,
                    PhotoPreview = x.PhotoPreview,
                    Rating = x.Rating,
                    RatingNumbers = x.RatingNumbers,
                    RatingSumm = x.RatingSumm,
                    Reads = x.Reads,
                    Source = x.Source,
                    Title = x.Title
                }).ToListAsync();
        }

        public async Task<int> GetCountAsync(Expression<Func<Material, bool>> filter = null)
        {
            IQueryable<Material> query = _context.Materials
                .Include(x => x.Category)
                .Include(x => x.Author);
            if (filter != null)
            {
                query = query.Where(filter);
            }

            return await query.CountAsync();
        }

        public Task<IEnumerable<Material>> GetListAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<ICollection<Material>> GetOrderedByAsync(int? page, int itemPerPage = 15, SortOrder order = SortOrder.Ascending, Expression<Func<Material, bool>> filter = null,
            Expression<Func<Material, object>> orderBy = null, params Expression<Func<Material, object>>[] includeProperties)
        {
            IQueryable<Material> query = _context.Materials
                .Include(x => x.Category)
                .Include(x => x.Author);
            if (filter != null)
            {
                query = query.Where(filter);
            }
            if (orderBy != null)
            {
                query = query.ObjectSort(orderBy, order);
            }
            if (includeProperties != null && includeProperties.Any())
            {
                query = includeProperties.Aggregate(query,
                    (current, includeProperty) => current.Include(includeProperty));
            }

            if (page.HasValue)
            {
                query = query.Skip((page.Value - 1) * itemPerPage).Take(itemPerPage);
            }

            return await query.ToListAsync();
        }

        public async Task<ICollection<Material>> GetOrderedByDescAndNotTopAsync(int? page, int itemPerPage = 15, Expression<Func<Material, bool>> filter = null,
            Expression<Func<Material, object>> orderBy = null, params Expression<Func<Material, object>>[] includeProperties)
        {
            IQueryable<Material> query = _context.Materials.Include(x => x.Category).Include(x => x.Author).Where(x => !x.OnTop);

            if (filter != null)
            {
                query = query.Where(filter);
            }
            if (orderBy != null)
            {
                query = query.ObjectSort(orderBy, SortOrder.Descending);
            }
            if (includeProperties != null && includeProperties.Any())
            {
                query = includeProperties.Aggregate(query,
                    (current, includeProperty) => current.Include(includeProperty));
            }

            if (page.HasValue)
            {
                query = query.Skip((page.Value - 1) * itemPerPage).Take(itemPerPage);
            }

            return await query.Select(x => new Material
            {
                Type = x.Type,
                Id = x.Id,
                OnTop = x.OnTop,
                LastModified = x.LastModified,
                Author = x.Author,
                AdditionTime = x.AdditionTime,
                AuthorId = x.AuthorId,
                Brief = x.Brief,
                CanCommentary = x.CanCommentary,
                Category = x.Category,
                CategoryId = x.CategoryId,
                Message = x.Message,
                CommentsCount = x.Comments.Count,
                Pending = x.Pending,
                PhotoPath = x.PhotoPath,
                PhotoPreview = x.PhotoPreview,
                Reads = x.Reads,
                Source = x.Source,
                Title = x.Title
            }).ToListAsync();
        }
    }
}
