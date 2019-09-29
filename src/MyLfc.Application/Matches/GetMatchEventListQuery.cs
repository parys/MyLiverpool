using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MyLfc.Persistence;
using MyLiverpool.Data.Common;

namespace MyLfc.Application.Matches
{
    public class GetMatchEventListQuery
    {
        public class Request : IRequest<Response>
        {
            public int MatchId { get; set; }
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
                var events = await _context.MatchEvents.AsNoTracking()
                    .Where(x => x.MatchId == request.MatchId)
                    .OrderBy(x => x.Minute)
                    .ProjectTo<MatchEventListDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return new Response{Results = events};
            }
        }


        [Serializable]
        public class Response
        {
            public List<MatchEventListDto> Results { get; set; }
        }


        [Serializable]
        public class MatchEventListDto
        {
            public int Id { get; set; }

            public int PersonId { get; set; }

            public string PersonName { get; set; }

            public MatchEventType Type { get; set; }

            public string TypeName { get; set; }

            public int SeasonId { get; set; }

            public string SeasonName { get; set; }

            public int MatchId { get; set; }

            public bool IsOur { get; set; }

            public byte? Minute { get; set; }

            public bool Home { get; set; }
        }
    }
}
