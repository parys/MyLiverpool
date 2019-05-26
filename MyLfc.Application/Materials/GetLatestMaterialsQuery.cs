﻿using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using MyLfc.Application.Infrastructure;
using MyLfc.Application.Infrastructure.Extensions;
using MyLfc.Domain;
using MyLfc.Persistence;
using MyLiverpool.Data.Common;

namespace MyLfc.Application.Materials
{
    public class GetLatestMaterialsQuery
    {
        public class Request : PagedQueryBase, IRequest<Response>
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
                var materialsQuery = _context.Materials.AsQueryable();

                materialsQuery = materialsQuery.Where(x => !x.Pending).OrderByDescending(x => x.AdditionTime);

                return await materialsQuery.GetPagedAsync<Response, Material, MaterialLatestListDto>(request, _mapper);
            }
        }


        public class Response : PagedResult<MaterialLatestListDto>
        {
        }


        public class MaterialLatestListDto
        {
            public int Id { get; set; }

            public int CategoryId { get; set; }

            public string CategoryName { get; set; }

            public bool CanCommentary { get; set; }
            
            public DateTimeOffset AdditionTime { get; set; }

            public int CommentsCount { get; set; }

            public string UserName { get; set; }

            public int UserId { get; set; }

            public string Title { get; set; }
            
            public int Reads { get; set; }

            public string PhotoPreview { get; set; }
            public string Photo { get; set; }

            public MaterialType Type { get; set; }

            public string TypeName { get; set; }
        }
    }
}
