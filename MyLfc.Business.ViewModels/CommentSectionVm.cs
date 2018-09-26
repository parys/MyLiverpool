using System;
using System.Collections.Generic;
using System.Text;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.Common;

namespace MyLfc.Business.ViewModels
{
    public class CommentSectionVm
    {
        public PageableData<CommentDto> Comments { get; set; }

        public int? MaterialId { get; set; }

        public int? MatchId { get; set; }
    }
}
