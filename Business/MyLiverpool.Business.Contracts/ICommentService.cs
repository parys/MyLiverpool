using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Business.Contracts
{
    public interface ICommentService
    {
        Task<bool> DeleteAsync(int id);

        Task<CommentDto> AddAsync(CommentDto model);

        Task<bool> UpdateAsync(CommentDto model);
        
        Task<PageableData<CommentDto>> GetListAsync(MaterialCommentFiltersDto filters);

        Task<PageableData<CommentDto>> GetListByMaterialIdAsync(int materialId, int page);

        Task<bool> VerifyAsync(int id);

        Task<bool> UpdateVoteAsync(CommentVoteDto dto);

        Task<IEnumerable<CommentDto>> GetLastListAsync();

        Task<PageableData<CommentDto>> GetListByMatchIdAsync(int matchId, int page);

        Task<int> CountAsync(Expression<Func<MaterialComment, bool>> filter = null);
    }
}
