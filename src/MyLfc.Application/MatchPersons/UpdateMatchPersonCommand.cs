using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MyLfc.Application.Infrastructure;
using MyLfc.Persistence;
using MyLiverpool.Data.Common;

namespace MyLfc.Application.MatchPersons
{
    public class UpdateMatchPersonCommand
    {
        public class Request : IRequest<Response>
        {
            public int MatchId { get; set; }

            public int PersonId { get; set; }

            public MatchPersonType PersonType { get; set; }

            public bool IsHome { get; set; }
        }


        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
            }
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
                var person = await _context.Persons
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.Id == request.PersonId, cancellationToken);
                
                var matchPerson = await _context.MatchPersons
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.MatchId == request.MatchId
                                              && x.PersonId == request.PersonId, cancellationToken);

                if (matchPerson == null)
                {
                    matchPerson = _mapper.Map(request, matchPerson);
                    matchPerson.Created = DateTime.UtcNow;
                    _context.MatchPersons.Add(matchPerson);
                }
                else
                {
                    matchPerson = _mapper.Map(request, matchPerson);
                    _context.MatchPersons.Update(matchPerson);
                }

                await _context.SaveChangesAsync(cancellationToken);


                return new Response {
                    PersonId = matchPerson.PersonId,
                    Number =  person.Number,
                    PersonName = person.RussianName,
                    Type = request.PersonType.GetMatchPlaceholderType(request.IsHome)
                };
            }
        }

        public class Response
        {
            public int PersonId { get; set; }

            public byte? Number { get; set; }

            public string PersonName { get; set; }

            public MatchPersonPlaceType Type { get; set; }
        }
    }
}
