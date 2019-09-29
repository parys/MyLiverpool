using System;
using System.IO;
using System.Linq;

namespace MyLiverpool.Common.Utilities
{
    public static class PathHelpers
    {
        public const int FilesPerFolder = 1200;

        public static string GenerateNewPath(string path, string webRootPath)
        {
            var fullPath = Path.Combine(webRootPath, path);
            if (!Directory.Exists(fullPath))
            {
                Directory.CreateDirectory(fullPath);
            }

            //workaround for folders _nw and _bl to skip them
            var directoryInfo = Directory.EnumerateDirectories(fullPath).LastOrDefault(x => !x.Contains("_"));
            if (directoryInfo == null)
            {
                directoryInfo = "0";
                Directory.CreateDirectory(Path.Combine(fullPath, directoryInfo));
            }

            var lastFolderName = int.Parse(directoryInfo.Split(Path.DirectorySeparatorChar).Last());
            var directoryName = lastFolderName.ToString();
            if (Directory.GetFiles(directoryInfo).Length >= FilesPerFolder)
            {
                directoryName = (lastFolderName + 1).ToString() + Path.DirectorySeparatorChar;
                directoryInfo = Path.Combine(fullPath, directoryName);
                Directory.CreateDirectory(directoryInfo);
            }

            return Path.Combine(path, directoryName);
        }

        public static string GenerateNewName()
        {
            var random = new Random((int)DateTime.Now.ToFileTimeUtc());
            string newName;
            do
            {
                newName = random.Next(100000, 999999).ToString();
            } while (File.Exists(newName));
            return newName;
        }

        public static string GetFullPath(string prefix, string name)
        {
            return Path.Combine(prefix, name);
        }
    }
}
