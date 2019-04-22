using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Conventions.Internal;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Data.Entities
{
    public class Material : IEntity
    {
        public int Id { get; set; }

        public int OldId { get; set; }
        
        public virtual MaterialCategory Category { get; set; }

        //public int Year { get; set; }

        //public int Month { get; set; }

        //public int Day { get; set; }

        public bool Pending { get; set; }

        public bool OnTop { get; set; }

        public bool CanCommentary { get; set; }

        public DateTimeOffset AdditionTime { get; set; }

        [NotMapped]
        public int CommentsCount { get; set; }

        public virtual User Author { get; set; }

        [MaxLength(200)]
        public string Title { get; set; }

        [MaxLength(1000)]
        public string Brief { get; set; }

        [MaxLength(80000)]
        public string Message { get; set; }

        public int Reads { get; set; }

        [MaxLength(300)]
        public string Source { get; set; }

        public float Rating { get; set; }

        public int RatingNumbers { get; set; }

        public int RatingSumm { get; set; }

        [MaxLength(400)]
        public string PhotoPath { get; set; }

        [MaxLength(400)]
        public string PhotoPreview { get; set; }

        public DateTimeOffset LastModified { get; set; }

        public virtual ICollection<MaterialComment> Comments { get; set; } = new List<MaterialComment>();

        public int CategoryId { get; set; }

        public int AuthorId { get; set; }

        public MaterialType Type { get; set; }

        public bool UsePhotoInBody { get; set; }

        public string Tags { get; set; }
    }
}
