using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MyLiverpool.Common.Utilities;

namespace MyLfc.Application.Clubs
{
    public class UpdateClubLogoCommand
    {
        public const string ContentPath = "content";
        public static readonly string LogoPath = Path.Combine(ContentPath, "logos");

        public class Request : IRequest<Response>
        {
            public IFormFile File { get; set; }

            public string Name { get; set; }
        }


        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IWebHostEnvironment _appEnvironment;

            public Handler(IWebHostEnvironment appEnvironment)
            {
                _appEnvironment = appEnvironment;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                string path = request.Name;

                var relativePath = path;
                if (string.IsNullOrEmpty(path) || !path.Contains(LogoPath))
                {
                    var newName = (string.IsNullOrWhiteSpace(path)
                                      ? PathHelpers.GenerateNewName()
                                      : path) + "." + request.File.FileName.Split('.').Last();
                    var newPath = PathHelpers.GenerateNewPath(LogoPath, _appEnvironment.WebRootPath);
                    relativePath = Path.Combine(newPath, newName);
                    path = Path.GetFullPath(relativePath, _appEnvironment.WebRootPath);
                }
                else
                {
                    path = Path.GetFullPath(path, _appEnvironment.WebRootPath);
                }

                using (var fileStream = File.Create(path))
                {
                    await request.File.CopyToAsync(fileStream, cancellationToken);
                }

                relativePath = Regex.Replace(relativePath, "\\\\", "/");
                
                return new Response {Path = "/" + relativePath };
            }
        }


        public class Response
        {
            public string Path { get; set; }
        }
    }
}
