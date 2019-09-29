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
    public class GetMatchPersonListQuery
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
                var persons = await _context.MatchPersons.AsNoTracking()
                    .Where(x => x.MatchId == request.MatchId)
                    .OrderBy(x => x.Created)
                    .ProjectTo<MatchPersonListDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return new Response{Results = persons};
            }
        }


        [Serializable]
        public class Response
        {
            public List<MatchPersonListDto> Results { get; set; }
        }


        [Serializable]
        public class MatchPersonListDto
        {
            public int Id { get; set; }

            public string FirstRussianName { get; set; }

            public string LastRussianName { get; set; }
            
            public byte? Number { get; set; }

            public MatchPersonType PersonType { get; set; }

            public string PersonName => $"{FirstRussianName} {LastRussianName}";
        }
    }
}
