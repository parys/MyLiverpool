namespace MyLiverpool.Business.Dto.Filters
{
    public class UserFiltersDto : BaseFiltersDto
    {
        public int? RoleGroupId { get; set; }

        public string UserName { get; set; }

        public string Ip { get; set; }
    }
}
