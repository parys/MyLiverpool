﻿using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MyLfc.Application.Infrastructure.Exceptions;
using MyLfc.Domain;
using MyLfc.Persistence;

namespace MyLfc.Application.Persons
{
    public class DeletePersonCommand
    {
        public class Request : IRequest<Response>
        {
            public int Id { get; set; }
        }


        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly LiverpoolContext _context;
            
            public Handler(LiverpoolContext context)
            {
                _context = context;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var person = await _context.Persons
                    .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
                
                if (person == null)
                {
                    throw new NotFoundException(nameof(Material), request.Id);
                }

                _context.Persons.Remove(person);

                await _context.SaveChangesAsync(cancellationToken);
                return new Response {Id = person.Id};
            }
        }

        public class Response
        {
            public int Id { get; set; }
        }
    }
}
