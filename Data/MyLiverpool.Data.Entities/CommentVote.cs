﻿using MyLfc.Domain;

namespace MyLiverpool.Data.Entities
{
    public class CommentVote
    {
        public int UserId { get; set; }

        public int CommentId { get; set; }

        public bool Positive { get; set; }

        public virtual User User { get; set; }

        public virtual MaterialComment Comment { get; set; }
    }
}
