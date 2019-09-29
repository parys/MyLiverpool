using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using MyLfc.Application.Infrastructure;
using MyLfc.Application.Infrastructure.Exceptions;
using MyLfc.Domain;
using MyLfc.Persistence;
using MyLiverpool.Common.Utilities;

namespace MyLfc.Application.Users
{
    public class UpdateUserAvatarCommand
    {
        public const string ContentPath = "content";
        public static readonly string AvatarPath = Path.Combine(ContentPath, "avatars");

        public class Request : IRequest<Response>
        {
            public IFormFile File { get; set; }
            
        }


        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly LiverpoolContext _context;

            private readonly RequestContext _requestContext;

            private readonly IHostingEnvironment _appEnvironment;

            public Handler(LiverpoolContext context, RequestContext requestContext, IHostingEnvironment appEnvironment)
            {
                _context = context;
                _requestContext = requestContext;
                _appEnvironment = appEnvironment;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == _requestContext.UserId,
                    cancellationToken);
                var path = user.Photo;
                if (user == null)
                {
                    throw new NotFoundException(nameof(User), _requestContext.UserId.Value);
                }

                var relativePath = path.Contains(GlobalConstants.DefaultPhotoPath)
                    ? PathHelpers.GenerateNewName()
                    : path.Split('.')
                        .First()
                        .Split(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar)
                        .Last();
                relativePath = relativePath + "." + request.File.FileName.Split('.').Last();

                var newPath = PathHelpers.GenerateNewPath(AvatarPath, _appEnvironment.WebRootPath);
                if (!path.Contains(GlobalConstants.DefaultPhotoPath))
                {
                    FileHelper.Delete(path);
                }

                path = Path.Combine(_appEnvironment.WebRootPath, newPath, relativePath);
                relativePath = Path.Combine(newPath, relativePath);
                using (var fileStream = new FileStream(path, FileMode.Create))
                {
                    await request.File.CopyToAsync(fileStream, cancellationToken);
                }

                relativePath = Regex.Replace(relativePath, "\\\\", "/");

                user.Photo = relativePath;
                await _context.SaveChangesAsync(cancellationToken);

                return new Response {Path = relativePath};
            }
        }


        public class Response
        {
            public string Path { get; set; }
        }
    }
}
