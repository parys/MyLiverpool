using MyLiverpool.Data.Common;

namespace MyLiverpool.Business.Dto.Filters
{
    public class PersonFiltersDto : BaseFiltersDto
    {
        public PersonType? Type { get; set; }

        public string Name { get; set; }

        public int? MatchId { get; set; }
    }
}
