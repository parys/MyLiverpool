using System;
using System.ComponentModel.DataAnnotations;
using MyLiverpool.Data.Common;
using Newtonsoft.Json;

namespace MyLiverpool.Business.Dto
{
    [Serializable]
    public class ChatMessageDto : IDto
    {
        public int Id { get; set; }

        public int AuthorId { get; set; }

        [Obsolete("Remove after 01.04.2019 use UserName")]
        public string AuthorUserName { get; set; }
        
        public string UserName { get; set; }

        public string Message { get; set; }

        public DateTimeOffset AdditionTime { get; set; }

        [JsonIgnore]
        [MaxLength(15)]
        public string Ip { get; set; }

        public ChatMessageTypeEnum Type { get; set; }
    }
}
