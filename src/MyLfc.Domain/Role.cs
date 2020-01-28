using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace MyLfc.Domain
{
    public class Role : IdentityRole<int>, IEntity
    {
        //public int Id { get; set; }
        //public string Name { get; set; }
        //public string ConcurrencyStamp { get; set; }
        //public string NormalizedName { get; set; }

        //public virtual ICollection<User> Users { get; set; }
        //public virtual ICollection<RoleClaim> Claims { get; set; }

        public virtual ICollection<RoleRoleGroup> RoleRoleGroups { get; set; } = new HashSet<RoleRoleGroup>();
        public virtual ICollection<IdentityUserRole<int>> Roles { get; } = new List<IdentityUserRole<int>>();

        //public int RoleGroupId { get; set; }
    }
}
