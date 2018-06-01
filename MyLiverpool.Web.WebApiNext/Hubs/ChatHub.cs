using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using Newtonsoft.Json;

namespace MyLiverpool.Web.WebApiNext.Hubs
{
    /// <summary>
    /// Contains all signalR methods.
    /// </summary>
    public class ChatHub : Hub
    {
        //private static readonly ConnectionMapping<string> _connections =
        //    new ConnectionMapping<string>();

        private readonly IChatMessageService _chatMessageService;

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="chatMessageService"></param>
        public ChatHub(IChatMessageService chatMessageService)
        {
            _chatMessageService = chatMessageService;
        }
        
        /// <summary>
        /// Sends to clients new chat message.
        /// </summary>
        /// <param name="chatMessage"></param>
        [Authorize]
        public async Task SendChat(ChatMessageDto chatMessage)
        {
            var id = Context.ConnectionId;
            var name = Context.User.Identity.Name;
            //  var chatMessage1 = JsonConvert.DeserializeObject<ChatMessageDto>(chatMessage);
            var result = await _chatMessageService.CreateAsync(chatMessage);
            if (result != null)
            {
                await Clients.All.SendAsync("SendChat", chatMessage);
            }
        }
    }
}
