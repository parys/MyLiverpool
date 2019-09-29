using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MyLfc.Application.Infrastructure;
using MyLfc.Application.Infrastructure.Extensions;
using MyLfc.Domain;
using MyLfc.Persistence;
using MyLiverpool.Data.Common;

namespace MyLfc.Application.Persons
{
    public class GetPersonListQuery
    {
        public class Request : PagedQueryBase, IRequest<Response>
        {
            public PersonType? Type { get; set; }

            public string Name { get; set; }

            public int? MatchId { get; set; }
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
                var personsQuery = _context.Persons.AsNoTracking();

                if (request.Type.HasValue)
                {
                    personsQuery = personsQuery.Where(x => x.Type == request.Type);
                }
                if (!string.IsNullOrWhiteSpace(request.Name))
                {
                    personsQuery = personsQuery.Where(x => x.FirstName.Contains(request.Name) ||
                                             x.LastName.Contains(request.Name) ||
                                             x.FirstRussianName.Contains(request.Name) ||
                                             x.LastRussianName.Contains(request.Name));
                }

                if (request.MatchId.HasValue)
                {
                    personsQuery = personsQuery.Where(x => x.Matches.Any(m => m.MatchId == request.MatchId.Value));
                }

                Expression<Func<Person, object>> sortBy = x => x.FirstRussianName;
                Expression<Func<Person, object>> thenBy = x => x.LastRussianName;
                if (!string.IsNullOrWhiteSpace(request.SortOn))
                {
                    if (request.SortOn.Contains(nameof(Person.LastRussianName),
                        StringComparison.InvariantCultureIgnoreCase))
                    {
                        sortBy = x => x.LastRussianName;
                        thenBy = x => x.FirstRussianName;
                    }
                    else if (request.SortOn.Contains(nameof(Person.FirstRussianName),
                        StringComparison.InvariantCultureIgnoreCase))
                    {
                        sortBy = x => x.FirstRussianName;
                        thenBy = x => x.LastRussianName;
                    }
                    else if (request.SortOn.Contains(nameof(Person.Birthday),
                        StringComparison.InvariantCultureIgnoreCase))
                    {
                        sortBy = x => x.Birthday;
                        thenBy = null;
                    }
                    else if (request.SortOn.Contains(nameof(Person.Position),
                        StringComparison.InvariantCultureIgnoreCase))
                    {
                        sortBy = x => x.Position;
                        thenBy = null;
                    }
                    else if (request.SortOn.Contains(nameof(Person.Country),
                        StringComparison.InvariantCultureIgnoreCase))
                    {
                        sortBy = x => x.Country;
                        thenBy = null;
                    }
                }
                 
                return await personsQuery.GetPagedAsync<Response, Person, PersonListDto>(request, _mapper, sortBy, thenBy);
            }
        }


        [Serializable]
        public class Response : PagedResult<PersonListDto>
        {
        }


        [Serializable]
        public class PersonListDto
        {
            public int Id { get; set; }

            public string FirstName { get; set; }

            public string FirstRussianName { get; set; }

            public string LastName { get; set; }

            public string LastRussianName { get; set; }

            public PersonType Type { get; set; }

            public string TypeName { get; set; }

            public string Position { get; set; }

            public byte? Number { get; set; }

            public string Country { get; set; }

            public DateTimeOffset? Birthday { get; set; }

            public string Photo { get; set; }

            public string Name => $"{FirstName} {LastName}";
            public string RussianName => $"{FirstRussianName} {LastRussianName}";
            public string PersonName => $"{FirstRussianName} {LastRussianName}";
        }
    }
}
