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
    public class MaterialCommentRepository : IMaterialCommentRepository
    {
        private readonly LiverpoolContext _context;

        public MaterialCommentRepository(LiverpoolContext context)
        {
            _context = context;
        }
        public async Task<MaterialComment> GetByIdAsync(int id)
        {
            return await _context.MaterialComments
                .Include(x => x.Children)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<MaterialComment> AddAsync(MaterialComment entity)
        {
            var addedEntity = await _context.MaterialComments.AddAsync(entity);
            await _context.SaveChangesAsync();
            return addedEntity.Entity;
        }

        public async Task DeleteAsync(int id)
        {
            var comment = await _context.MaterialComments.FindAsync(id);
            if (comment != null)
            {
                await DeleteAsync(comment);
            }
        }

        public async Task DeleteAsync(MaterialComment entity)
        {
            _context.MaterialComments.Remove(entity);
            await _context.SaveChangesAsync();
        }
        
        public async Task UpdateAsync(MaterialComment entity)
        {
            _context.MaterialComments.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
        
        public async Task<int> GetCountAsync(Expression<Func<MaterialComment, bool>> filter = null)
        {
            IQueryable<MaterialComment> query = _context.MaterialComments;
            if (filter != null)
            {
                query = query.Where(filter);
            }

            return await query.CountAsync();
        }

        public async Task<IEnumerable<MaterialComment>> GetListAsync()
        {
            return await _context.MaterialComments.ToListAsync(); //todo for migrator
            throw new NotImplementedException("Not need to implement");
        }

        public async Task<CommentVote> GetVoteByIdAsync(int commentId, int userId)
        {
            return await _context.CommentVotes.FindAsync(userId, commentId);
        }

        public async Task AddVoteAsync(CommentVote vote)
        {
            await _context.CommentVotes.AddAsync(vote);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateVoteAsync(CommentVote vote)
        {
            _context.CommentVotes.Update(vote);
            await _context.SaveChangesAsync();
        }

        public async Task<ICollection<MaterialComment>> GetOrderedByAsync(int? page, int itemPerPage = 15,
            Expression<Func<MaterialComment, bool>> filter = null,
            SortOrder order = SortOrder.Ascending, Expression<Func<MaterialComment, object>> orderBy = null)
        {
            IQueryable<MaterialComment> query =
                _context.MaterialComments.Include(x => x.Author).Include(x => x.CommentVotes);

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

            return await query.ToListAsync();
        }

        public async Task<ICollection<MaterialComment>> GetLastAsync(int itemPerPage = 15,
            SortOrder order = SortOrder.Descending, Expression<Func<MaterialComment, object>> orderBy = null)
        {
            IQueryable<MaterialComment> query =
                _context.MaterialComments.Include(x => x.Author);

            if (orderBy != null)
            {
                query = query.ObjectSort(orderBy, order);
            }
            query = query.Take(itemPerPage);
            return await query.ToListAsync();
        }

        public void UpdateRange(List<MaterialComment> comments)
        {
           _context.MaterialComments.UpdateRange(comments);
        }
    }
}
