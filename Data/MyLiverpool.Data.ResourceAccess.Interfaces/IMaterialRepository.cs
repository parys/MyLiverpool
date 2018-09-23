using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Data.ResourceAccess.Interfaces
{
    public interface IMaterialRepository: ICrudRepository<Material>
    {
        Task<ICollection<Material>> GetTopMaterialsAsync(Expression<Func<Material, bool>> filter = null);

        Task<ICollection<Material>> GetOrderedByAsync(int? page, int itemPerPage = 15,
            SortOrder order = SortOrder.Ascending,
            Expression<Func<Material, bool>> filter = null, Expression<Func<Material, object>> orderBy = null,
            params Expression<Func<Material, object>>[] includeProperties);

        Task<ICollection<Material>> GetOrderedByDescAndNotTopAsync(int? page, int itemPerPage = 15, Expression<Func<Material, bool>> filter = null,
            Expression<Func<Material, object>> orderBy = null,
            params Expression<Func<Material, object>>[] includeProperties);

        Task<IEnumerable<Material>> GetAsync(); // for migrator
    }
}
