using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages images.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme, Roles = nameof(RolesEnum.NewsStart) +"," + nameof(RolesEnum.BlogStart)), Route("api/v1/[controller]")]
    public class ImagesController : Controller
    {
        private const string PathContent = "content";
        private const string PathImages = "images";
        private readonly string _pathFull = Path.Combine("content", "images");
        private readonly IWebHostEnvironment _env;
        private readonly IUploadService _uploadService;
        
        /// <summary>
        /// Constructor.
        /// </summary>
        public ImagesController(IWebHostEnvironment environment, IUploadService uploadService)
        {
            _env = environment;
            _uploadService = uploadService;
        }

        /// <summary>
        /// Returns all folders and files that contains in specified path.
        /// </summary>
        /// <param name="path">Path to show.</param>
        /// <returns>List of folders and files.</returns>
        [HttpGet("")]
        public async Task<IActionResult> Get([FromQuery]string path)
        {
            List<ImageDto> files = new List<ImageDto>();
            if (string.IsNullOrWhiteSpace(path) || path == "undefined")
            {
                path = _pathFull;
            }
            if (!path.Contains(PathContent))
            {
                path = Path.Combine(_pathFull, path);
            }
            //CHECK ONLY ALLOWED PATHES
            IEnumerable<string> subdirectoryFolders;
            IEnumerable<string> subdirectoryFiles;
            var fullPath = Path.Combine(_env.WebRootPath, path);
            try
            {
                subdirectoryFolders = Directory.EnumerateDirectories(fullPath);
                subdirectoryFiles = Directory.EnumerateFiles(fullPath); //, "*.jpeg,*.jpg,*.png");
            }
            catch (DirectoryNotFoundException)
            {
                fullPath = Path.Combine(_env.ContentRootPath, _pathFull);
                subdirectoryFolders = Directory.EnumerateDirectories(fullPath);
                subdirectoryFiles = Directory.EnumerateFiles(fullPath);
            }

            foreach (var entry in subdirectoryFolders)
            {
                var index = entry.LastIndexOf(_pathFull, StringComparison.OrdinalIgnoreCase);
                if (index == -1)
                {
                    index = entry.LastIndexOf(PathContent, StringComparison.OrdinalIgnoreCase);
                }
                files.Add(new ImageDto
                {
                    Name = entry.Substring(entry.LastIndexOf(Path.DirectorySeparatorChar) + 1),
                    Path = entry.Substring(index),
                    IsFolder = true
                });
            }
            foreach (var entry in subdirectoryFiles)
            {

                var index = entry.LastIndexOf(_pathFull, StringComparison.OrdinalIgnoreCase);
                if (index == -1)
                {
                    index = entry.LastIndexOf(PathContent, StringComparison.OrdinalIgnoreCase);
                }
                files.Add(new ImageDto
                {
                    Name = entry.Substring(entry.LastIndexOf(Path.DirectorySeparatorChar) + 1),
                    Path = entry.Substring(index),
                    IsFolder = false
                });
            }
            return await Task.FromResult(Ok(files));
        }

        /// <summary>
        /// Upload new images.
        /// </summary>
        /// <returns>Result of uploading.</returns>
        [Authorize(Roles = nameof(RolesEnum.NewsStart) + "," + nameof(RolesEnum.BlogStart)), HttpPost("")]
        public async Task<IActionResult> UploadImagesAsync()
        {
            if (Request.Form.Files != null && Request.Form.Files.Count > 0)
            {
                var files = Request.Form.Files;
                var result = await _uploadService.UploadAsync(files);

                return Ok(result);
            }
            return BadRequest();
        }

        /// <summary>
        /// Upload new images.
        /// </summary>
        /// <returns>Result of uploading.</returns>
        [Authorize(Roles = nameof(RolesEnum.NewsStart) + "," + nameof(RolesEnum.BlogStart)), HttpPost("base64")]
        public async Task<IActionResult> UploadImageBase64Async([FromBody] string imageBase64)
        {
            if (!string.IsNullOrWhiteSpace(imageBase64))
            {
                return Json(await _uploadService.UploadAsync(imageBase64));
            }

            return BadRequest();
        }
    }
}
