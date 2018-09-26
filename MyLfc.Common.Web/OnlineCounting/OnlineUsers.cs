using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using MessagePack;

namespace MyLfc.Common.Web.OnlineCounting
{
    /// <summary>
    /// 
    /// </summary>
    public static class OnlineUsers
    {
        /// <summary>
        /// Current online guests.
        /// </summary>
        public static readonly ConcurrentBag<string> CurrentOnlineGuests = new ConcurrentBag<string>();

        /// <summary>
        /// Current online users.
        /// </summary>
        public static readonly ConcurrentDictionary<string, OnlineCounterModel> CurrentOnline = new ConcurrentDictionary<string, OnlineCounterModel>();
        
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static OnlineUsersDto GetStats()
        {
            var users = CurrentOnline.Values
                .GroupBy(p => p.UserName)
                .Select(g => g.First());
            return new OnlineUsersDto
            {
                AllCount = users.Count() + CurrentOnlineGuests.Count,
                GuestCount = CurrentOnlineGuests.Count,
                Users = users
            };
        }
    }

    /// <summary>
    /// Contains signed user.
    /// </summary>
    [MessagePackObject]
    public class OnlineCounterModel
    {
        /// <summary>
        /// The identifier of user.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// UserName.
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// UserName.
        /// </summary>
        public string ConnectionId { get; set; }
    }

    /// <summary>
    /// Contains guests count and list of users.
    /// </summary>
    [MessagePackObject]
    public class OnlineUsersDto
    {
        /// <summary>
        /// Sum users and guests count.
        /// </summary>
        [Key("allCount")]
        public int AllCount { get; set; }

        /// <summary>
        /// Guests count.
        /// </summary>
        [Key("guestCount")]
        public int GuestCount { get; set; }

        /// <summary>
        /// List of signed users.
        /// </summary>
        [Key("users")]
        public IEnumerable<OnlineCounterModel> Users { get; set; } = new List<OnlineCounterModel>();
    }
}
