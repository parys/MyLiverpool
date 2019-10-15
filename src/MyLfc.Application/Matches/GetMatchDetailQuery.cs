using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MyLfc.Application.Clubs;
using MyLfc.Application.Infrastructure.Exceptions;
using MyLfc.Domain;
using MyLfc.Persistence;

namespace MyLfc.Application.Matches
{
    public class GetMatchDetailQuery
    {
        public class Request : IRequest<Response>
        {
            public int Id { get; set; }
        }


        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly LiverpoolContext _context;

            private readonly IMapper _mapper;

            private readonly IMediator _mediator;

            public Handler(LiverpoolContext context, IMapper mapper, IMediator mediator)
            {
                _context = context;
                _mapper = mapper;
                _mediator = mediator;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var match = await _context.Matches.AsNoTracking()
                    .Include(x => x.Stadium)
                    .Include(x => x.Club)
                    .Include(x => x.Events)
                    .Include(x => x.Season)
                    .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

                var liverpoolClub = await _mediator.Send(new GetLiverpoolClubQuery.Request(), cancellationToken);
                if (liverpoolClub == null)
                {
                    return null;
                }
                if (match == null)
                {
                    return null;
                }
                var response = _mapper.Map<Response>(match);
                if (match.IsHome)
                {
                    FillClubsFields(response, liverpoolClub, match.Club);
                }
                else
                {
                    FillClubsFields(response, match.Club, liverpoolClub);
                }

                if (match == null)
                {
                    throw new NotFoundException(nameof(Match), request.Id);
                }

                return response;
            }

            private static void FillClubsFields(Response dto, Club homeClub, Club awayClub)
            {
                dto.HomeClubId = homeClub.Id;
                dto.HomeClubName = homeClub.Name;
                dto.HomeClubLogo = homeClub.Logo;
                dto.AwayClubId = awayClub.Id;
                dto.AwayClubName = awayClub.Name;
                dto.AwayClubLogo = awayClub.Logo;
            }
        }


        [Serializable]
        public class Response
        {
            public int Id { get; set; }

            public int ClubId { get; set; }

            public string ClubName { get; set; }

            public bool IsHome { get; set; }
            
            public int HomeClubId { get; set; }

            public string HomeClubName { get; set; }

            public string HomeClubLogo { get; set; }

            public int AwayClubId { get; set; }

            public string AwayClubName { get; set; }

            public string AwayClubLogo { get; set; }

            public DateTimeOffset DateTime { get; set; }

            public int TypeId { get; set; }

            public string TypeName { get; set; }

            public string StadiumName { get; set; }

            public string StadiumCity { get; set; }

            public int StadiumId { get; set; }

            public string ScoreHome { get; set; }

            public int? ScorePenaltyHome { get; set; }

            public string ScoreAway { get; set; }

            public int? ScorePenaltyAway { get; set; }

            public int SeasonId { get; set; }

            public string SeasonName { get; set; }

            public string ReportUrl { get; set; }

            public string PhotoUrl { get; set; }

            public string VideoUrl { get; set; }

            public int? PreviewId { get; set; }

            public int? ReportId { get; set; }
        }
    }
}
