﻿using System.Collections.Generic;

namespace MyLfc.Domain
{
    public class RoleGroup : IEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string RussianName { get; set; }

        public ICollection<RoleRoleGroup> RoleGroups { get; set; } = new HashSet<RoleRoleGroup>();

        public ICollection<User> Users { get; set; } = new HashSet<User>();
    }
}
