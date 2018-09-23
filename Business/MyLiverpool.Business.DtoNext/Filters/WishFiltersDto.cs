namespace MyLiverpool.Business.Dto.Filters
{
    public class WishFiltersDto : BaseFiltersDto
    {
        public int? TypeId { get; set; } = null;
        public string FilterText { get; set; } = null;
    }
}
