using System.Linq;
using Microsoft.AspNetCore.SignalR;
using MyLfc.Common.Web.MessagePack;
using MyLfc.Common.Web.OnlineCounting;

namespace MyLfc.Common.Web.Hubs
{
    /// <summary>
    /// Provides calls to both hubs.
    /// </summary>
    public class SignalRHubAggregator : ISignalRHubAggregator
    {
        private readonly IHubContext<AnonymHub> _anonymHub;
        private readonly IHubContext<AuthHub> _authHub;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="anonymHub"></param>
        /// <param name="authHub"></param>
        public SignalRHubAggregator(IHubContext<AnonymHub> anonymHub, IHubContext<AuthHub> authHub)
        {
            _anonymHub = anonymHub;
            _authHub = authHub;
        }

        /// <summary>
        /// Notify clients with model.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="endpoint"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        public async void Send<T>(string endpoint, T model)// where T : IMessagePackObject
        {
            await _anonymHub.Clients.All.SendAsync(endpoint, model);
            await _authHub.Clients.All.SendAsync(endpoint, model);
        }

        /// <summary>
        /// Only notify.
        /// </summary>
        /// <param name="endpoint"></param>
        /// <returns></returns>
        public async void Send(string endpoint)
        {
            await _anonymHub.Clients.All.SendAsync(endpoint);
            await _authHub.Clients.All.SendAsync(endpoint);
        }
        
        /// <summary>
        /// Sends message to specific authenticated user to all him clients
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="endpoint"></param>
        /// <param name="obj"></param>
        /// <param name="userId"></param>
        public async void SendToUser<T>(string endpoint, T obj, int userId)// where T : IMessagePackObject
        {
            var receivers = OnlineUsers.CurrentOnline.Values.Where(x => x.Id == userId);
            if (receivers.Any())
            {
                //   await _authHub.Clients.User(receiver.Id.ToString()).SendAsync(HubEndpointConstants.PmReadEndpoint, true);
                await _authHub.Clients.Clients(receivers.Select(x => x.ConnectionId).ToList()).SendAsync(endpoint, obj);
            }
        }
    }

    /// <summary>
    /// Provides constants for hub methods or endpoints.
    /// </summary>
    public sealed class HubEndpointConstants
    {
        /// <summary>
        /// Chat endpoint.
        /// </summary>
        public const string ChatEndpoint = "UpdateChat";

        /// <summary>
        /// Users online endpoint.
        /// </summary>
        public const string UsersOnlineEndpoint = "UpdateOnline";

        /// <summary>
        /// New pm sent endpoint.
        /// </summary>
        public const string NewPmEndpoint = "NewPm";

        /// <summary>
        /// Pn was read endpoint.
        /// </summary>
        public const string PmReadEndpoint = "ReadPm";

        /// <summary>
        /// New pm sent endpoint.
        /// </summary>
        public const string NewNotifyEndpoint = "NewNotify";

        /// <summary>
        /// Pn was read endpoint.
        /// </summary>
        public const string NotifyReadEndpoint = "ReadNotify";

        public const string AddComment = "addComment";

        public const string NewComment = "newComment";

        public const string AddMatchPerson = "addMp";

        public const string AddMatchEvent = "addMe";
    }
}
