using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using MyLfc.Domain;
using MyLfc.Persistence;
using MyLiverpool.Data.Common;

namespace MyLfc.Application.Persons
{
    public class CreatePersonCommand
    {
        public class Request : UpsertPersonCommand.Request, IRequest<Response>
        {
        }


        public class Validator : UpsertPersonCommand.Validator<Request>
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
                var entity = _mapper.Map<Person>(request);

                _context.Persons.Add(entity);
                await _context.SaveChangesAsync(cancellationToken);

                return _mapper.Map<Response>(entity);
            }
        }

        //todo temporary
        public class Response
        {
            public int Id { get; set; }

            public string RussianName => FirstRussianName + " " + LastRussianName;
            public string PersonName => FirstRussianName + " " + LastRussianName;

            public string FirstRussianName { get; set; }

            public string LastRussianName { get; set; }

            public PersonType Type { get; set; }

            public string TypeName { get; set; }

            public string Position { get; set; }

            public byte? Number { get; set; }

            public string Country { get; set; }

            public DateTimeOffset? Birthday { get; set; }

            public string Photo { get; set; }
        }
    }
}
