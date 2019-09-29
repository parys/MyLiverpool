using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MyLiverpool.Common.Utilities;

namespace MyLfc.Application.Persons
{
    public class UpdatePersonPhotoCommand
    {
        public const string ContentPath = "content";
        public static readonly string PersonPath = Path.Combine(ContentPath, "persons");

        public class Request : IRequest<Response>
        {
            public IFormFile File { get; set; }

            public string Name { get; set; }
        }


        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IHostingEnvironment _appEnvironment;

            public Handler(IHostingEnvironment appEnvironment)
            {
                _appEnvironment = appEnvironment;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var extension = request.File.FileName.Split('.').Last();
                var fileName = request.Name.Replace(" ", "") + "." + extension;
                string path = PersonPath + fileName;

                var relativePath = path;
                path = Path.Combine(_appEnvironment.WebRootPath, path);
                if (!Directory.Exists(PersonPath))
                {
                    Directory.CreateDirectory(PersonPath);
                }

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await request.File.CopyToAsync(stream, cancellationToken);
                }
                relativePath = Regex.Replace(relativePath, "\\\\", "/");

                return new Response {Path = relativePath};
            }
        }


        public class Response
        {
            public string Path { get; set; }
        }
    }
}
