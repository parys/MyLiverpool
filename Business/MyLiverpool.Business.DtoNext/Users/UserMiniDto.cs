﻿using System;

namespace MyLiverpool.Business.Dto
{
    [Serializable]
    public class UserMiniDto : IDto
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public bool EmailConfirmed { get; set; }

        public int CommentsCount { get; set; }

        public DateTimeOffset LastModified { get; set; }

        public DateTimeOffset RegistrationDate { get; set; }

        public string RoleGroupName { get; set; }

        public string Photo { get; set; }
    }
}