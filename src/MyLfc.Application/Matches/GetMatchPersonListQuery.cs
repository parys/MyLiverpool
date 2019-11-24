using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MyLfc.Application.Infrastructure;
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

                var isHome = await _context.Matches.AsNoTracking()
                    .Where(x => x.Id == request.MatchId)
                    .Select(x => x.IsHome)
                    .FirstAsync(cancellationToken);

                var dict = new Dictionary<int, List<MatchPersonListDto>>();
                foreach (int value in Enum.GetValues(typeof(MatchPersonPlaceType)))
                {
                    dict.Add(value, new List<MatchPersonListDto>());
                }
                foreach (var person in persons)
                {
                    dict[(int)person.PersonType.GetMatchPlaceholderType(isHome)].Add(person);
                }

                return new Response {Results = dict};
            }

        }


        [Serializable]
        public class Response
        {
            public Dictionary<int, List<MatchPersonListDto>> Results =
                new Dictionary<int, List<MatchPersonListDto>>();
        }

        [Serializable]
        public class MatchPersonListDto
        {
            public int PersonId { get; set; }

            public byte? Number { get; set; }

            public MatchPersonType PersonType { get; set; }

            public string PersonName { get; set; }
        }
    }
}
