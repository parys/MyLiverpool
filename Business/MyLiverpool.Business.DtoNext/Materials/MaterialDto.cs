using System;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Business.Dto
{
    [Serializable]
    public class MaterialDto : IDto
    {
        public int Id { get; set; }

        public int CategoryId { get; set; }
      
        public string CategoryName { get; set; }

        public DateTimeOffset AdditionTime { get; set; }

        public int CommentsCount { get; set; }

        public int UserId { get; set; }

        public string UserName { get; set; }

        public string Title { get; set; }
        
        public string Brief { get; set; }
        
        public string Message { get; set; }

        public int Reads { get; set; }

        public string Source { get; set; }

        public string ShortLink { get; set; }

        public string Photo { get; set; }

        public string PhotoPreview { get; set; }

        public bool Pending { get; set; }

        public bool OnTop { get; set; }

        public bool CanCommentary { get; set; }

        public bool SocialLinks { get; set; }

        public MaterialType Type { get; set; }

        public string TypeName { get; set; }

        public int? NextMaterialId { get; set; }

        public string NextMaterialTitle { get; set; }

        public int? PrevMaterialId { get; set; }

        public string PrevMaterialTitle { get; set; }

        public bool UsePhotoInBody { get; set; }

        public string Tags { get; set; }
    }
}
