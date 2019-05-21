﻿using System;
using System.ComponentModel.DataAnnotations;
using MyLfc.Domain;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Data.Entities
{
    public class ChatMessage : IEntity
    {
        public int Id { get; set; }

        public int AuthorId { get; set; }

        public virtual User Author { get; set; }

        public string Message { get; set; }

        public DateTimeOffset AdditionTime { get; set; }

        [MaxLength(15)]
        public string Ip { get; set; }

        public ChatMessageTypeEnum Type { get; set; }
    }
}
