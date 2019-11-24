using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MyLiverpool.Common.Utilities
{
    public static class FileHelper
    {
        public const string ContentPath = "content";
        public static readonly string PersonPath = Path.Combine(ContentPath, "persons");

        public static bool Delete(string path)
        {
            if (File.Exists(path))
            {
                GC.Collect();
                GC.WaitForPendingFinalizers();
                File.Delete(path);
            }
            return true;
        }

        private const string jpegBase64 = "data:image/jpeg;base64,";
        private const string webpBase64 = "data:image/webp;base64,";

        public static async Task<string> SaveMaterialPhotoAsync(string base64File, string contentPath, string webRootPath)
        {
            string extension;
            (extension, base64File) = GetBase64Type(base64File);

            var newName = PathHelpers.GenerateNewName() + "." + extension;
            var newPath = PathHelpers.GenerateNewPath(contentPath, webRootPath);
            var relativePath = Path.Combine(newPath, newName);
            var path = Path.Combine(webRootPath, relativePath);
            relativePath = Regex.Replace(relativePath, "\\\\", "/");
            await File.WriteAllBytesAsync(path, Convert.FromBase64String(base64File));
            return "/" + relativePath;
        }

        public static async Task<string> SavePersonPhotoAsync(string base64File, string personPath, string webRootPath)
        {
            string extension;
            (extension, base64File) = GetBase64Type(base64File);
            var relativePath = Path.Combine(PersonPath, $"{personPath}.{extension}");
            personPath = Path.Combine(webRootPath, relativePath);
            if (!Directory.Exists(PersonPath))
            {
                Directory.CreateDirectory(PersonPath);
            }

            await File.WriteAllBytesAsync(personPath, Convert.FromBase64String(base64File));
            return Regex.Replace(relativePath, "\\\\", "/");
        }

        private static (string, string) GetBase64Type(string base64File)
        {
            string extension = "jpeg";
            if (base64File.Contains(jpegBase64))
            {
                extension = "jpeg";
                base64File = base64File.Replace(jpegBase64, "");
            }
            else if (base64File.Contains(webpBase64))
            {
                extension = "webp";
                base64File = base64File.Replace(webpBase64, "");
            }

            base64File = base64File.Replace(",", "");
            return (extension, base64File);
        }
    }
}
