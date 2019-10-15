using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MyLfc.Persistence;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Common;

namespace MyLfc.Application.Comments
{
    public class GetLastCommentListQuery
    {
        public class Request : IRequest<Response>
        {
        }


        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly LiverpoolContext _context;

            private readonly IMapper _mapper;
            
            public Handler(LiverpoolContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var comments = await _context.MaterialComments
                    .AsNoTracking()
                    .OrderByDescending(x => x.AdditionTime)
                    .Take(GlobalConstants.LastCommentsCount)
                    .ProjectTo<LastCommentDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                foreach (var comment in comments)
                {
                    comment.Message = Regex.Replace(Regex.Replace(comment.Message, "&.*?;", string.Empty), "<.*?>", string.Empty);
                    if (comment.Message.Length > GlobalConstants.LastCommentMessageSymbolCount)
                        comment.Message = comment.Message.Substring(0, GlobalConstants.LastCommentMessageSymbolCount) +
                                          "...";
                }

                return new Response
                {
                    Results = comments
                };
            }
        }


        [Serializable]
        public class Response
        {
            public List<LastCommentDto> Results { get; set; }
        }


        [Serializable]
        public class LastCommentDto
        {
            public int Id { get; set; }

            public string AuthorUserName { get; set; }

            public int AuthorId { get; set; }
         
            public string Message { get; set; }

            public int? MaterialId { get; set; }

            public int? MatchId { get; set; }
            
            public CommentType Type { get; set; }

            public string TypeName { get; set; }
        }
    }
}
