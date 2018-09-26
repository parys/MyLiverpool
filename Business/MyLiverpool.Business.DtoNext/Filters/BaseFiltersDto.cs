using System.Data.SqlClient;

namespace MyLiverpool.Business.Dto.Filters
{
    public class BaseFiltersDto : IDto
    {
        public int? Page { get; set; } = null;

        public int ItemsPerPage { get; set; } = 15;

        public string Order { get; set; }

        public string SortBy { get; set; }


        public SortOrder SortOrder => !string.IsNullOrWhiteSpace(Order) && Order.Contains("asc") ? SortOrder.Ascending : SortOrder.Descending; 
    }
}
