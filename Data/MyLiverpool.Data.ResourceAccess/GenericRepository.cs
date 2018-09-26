using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Data.ResourceAccess
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        private readonly LiverpoolContext _context;

        public GenericRepository(LiverpoolContext context)
        {
            _context = context;
        }

        public async Task<TEntity> CreateAsync(TEntity entity)
        {
            var entityEntry = await _context.Set<TEntity>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return entityEntry.Entity;
        }
        
        public async Task<TEntity> GetFirstByPredicateAsync(Expression<Func<TEntity, bool>> predicate,
            bool noTracking = false,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null)
        {
            IQueryable<TEntity> query = _context.Set<TEntity>();
            if (noTracking)
            {
                query = query.AsNoTracking();
            }
            if (include != null)
            {
                query = include(query);
            }
            return await query.FirstOrDefaultAsync(predicate);
        }

        public async Task<TEntity> UpdateAsync(TEntity entity)
        {
            _context.Set<TEntity>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateRangeAsync(IEnumerable<TEntity> entities)
        {
            _context.Set<TEntity>().UpdateRange(entities);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(TEntity entity)
        {
            _context.Set<TEntity>().Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Expression<Func<TEntity, bool>> predicate)
        {
            if (predicate != null)
            {

                var entity = await _context.Set<TEntity>().FirstOrDefaultAsync(predicate);
                if (entity != null)
                {
                    return await DeleteAsync(entity);
                }
            }

            return false;
        }

        public async Task DeleteRangeAsync(IEnumerable<TEntity> entities)
        {
            if (entities.Any())
            {
                _context.Set<TEntity>().RemoveRange(entities);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> CountAsync(Expression<Func<TEntity, bool>> filter = null)
        {
            IQueryable<TEntity> query = _context.Set<TEntity>().AsNoTracking();
            if (filter != null)
            {
                query = query.Where(filter);
            }
            return await query.CountAsync();
        }
        
        public async Task<IEnumerable<TEntity>> GetListAsync(int? page = null, int itemPerPage = 15, bool asNoTracking = true,
            Expression<Func<TEntity, bool>> filter = null, SortOrder order = SortOrder.Ascending,
            Expression<Func<TEntity, object>> orderBy = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null)
        {
            return await GetQueryableList(page, itemPerPage, asNoTracking, filter, order, orderBy, include).ToListAsync();
        }

        public IQueryable<TEntity> GetQueryableList(int? page = null, int itemPerPage = 15, bool asNoTracking = true,
            Expression<Func<TEntity, bool>> filter = null, SortOrder order = SortOrder.Ascending,
            Expression<Func<TEntity, object>> orderBy = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null)
        {
            IQueryable<TEntity> query = _context.Set<TEntity>();
            if (include != null)
            {
                query = include(query);
            }
            if (filter != null)
            {
                query = query.Where(filter);
            }
            if (orderBy != null)
            {
                query = query.ObjectSort(orderBy, order);
            }
            if (page.HasValue)
            {
                query = query.Skip((page.Value - 1) * itemPerPage).Take(itemPerPage);
            }

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }
            return query;
        }
    }
}
