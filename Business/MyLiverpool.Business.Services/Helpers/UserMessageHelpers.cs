using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace MyLiverpool.Business.Services.Helpers
{
    public static class UserMessageHelpers
    {
        private static List<Regex> regexes = new List<Regex>();

        static UserMessageHelpers()
        {
            regexes.Add(new Regex("[нахуй|хуй|блять|бля|пизда|пиздец|охуеть|сука|сучара|гнида|мудак|нахер|хер|мудень|мудло|]",RegexOptions.Compiled));
        }

        public static string SanitizeCommentByRudeWords(this string message)
        {
            var regex1 = new Regex("", RegexOptions.Compiled);
            foreach (var regex in regexes)
            {
                message = regex.Replace(message, "");
            }
            return message;
        }
    }
}
