using System.IO;
using System.IO.Compression;
using Microsoft.AspNetCore.ResponseCompression;

namespace MyLfc.Common.Web
{
    public class BrotliCompressionProvider : ICompressionProvider
    {
        public string EncodingName => "br";
        public bool SupportsFlush => true;

        public Stream CreateStream(Stream outputStream)
        {
            return new BrotliStream(
                outputStream,
                CompressionMode.Compress,
                false
              //  bufferSize: 65520,
              //  quality: CompressionLevel.Optimal
                ); // very costly, may not be appropriate for a web server
        }
    }
}
