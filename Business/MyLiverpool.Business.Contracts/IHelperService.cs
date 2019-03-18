using System.Threading.Tasks;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;

namespace MyLiverpool.Business.Contracts
{
    public interface IHelperService
    {
        Task<string> GetValueAsync(HelperEntityType type);

        Task<HelpEntity> GetAsync(HelperEntityType type);

        Task<bool> CreateOrUpdateAsync(HelperEntityType type, string newValue);

        Task<string> SanitizeRudWordsAsync(string message);
    }
}
