using Microsoft.AspNetCore.Authorization;

namespace MyLfc.Common.Web.Hubs
{
    /// <summary>
    /// Hub for athenticated users.
    /// </summary>
    [Authorize()]
    public class AuthHub : AnonymHub
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="signalRHub"></param>
        public AuthHub(ISignalRHubAggregator signalRHub) : base(signalRHub)
        {
        }
    }
}
