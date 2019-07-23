﻿using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
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
            public MaterialType MaterialType { get; set; }
        }


        public class Validator : UpsertPersonCommand.Validator<Request>
        {
            public Validator()
            {
                RuleFor(v => v.MaterialType).IsInEnum().NotEqual(MaterialType.Both);
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
                var entity = _mapper.Map<MaterialCategory>(request);

                _context.MaterialCategories.Add(entity);
                await _context.SaveChangesAsync(cancellationToken);

                return new Response {Id = entity.Id};
            }
        }


        public class Response
        {
            public int Id { get; set; }
        }
    }
}
