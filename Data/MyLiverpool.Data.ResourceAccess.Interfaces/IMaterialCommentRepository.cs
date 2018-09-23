using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Data.ResourceAccess.Interfaces
{
    public interface IMaterialCommentRepository : ICrudRepository<MaterialComment>
    {
        Task<ICollection<MaterialComment>> GetOrderedByAsync(int? page, int itemPerPage = 15,
    Expression<Func<MaterialComment, bool>> filter = null, SortOrder order = SortOrder.Ascending,
    Expression<Func<MaterialComment, object>> orderBy = null);

        Task<ICollection<MaterialComment>> GetLastAsync(int itemPerPage = 15,
            SortOrder order = SortOrder.Descending, Expression<Func<MaterialComment, object>> orderBy = null);

        void UpdateRange(List<MaterialComment> comments);

        Task<IEnumerable<MaterialComment>> GetListAsync();

        Task<CommentVote> GetVoteByIdAsync(int commentId, int userId);

        Task AddVoteAsync(CommentVote vote);

        Task UpdateVoteAsync(CommentVote vote);
    }
}
