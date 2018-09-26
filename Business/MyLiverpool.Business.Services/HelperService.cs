using System.Threading.Tasks;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Data.Common;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class HelperService : IHelperService
    {
        private readonly IGenericRepository<HelpEntity> _helpEntityRepository;

        public HelperService(IGenericRepository<HelpEntity> helpEntityRepository)
        {
            _helpEntityRepository = helpEntityRepository;
        }

        public async Task<string> GetValueAsync(HelperEntityType type)
        {
            var entity = await _helpEntityRepository.GetFirstByPredicateAsync(x => x.Type == type);
            return entity?.Value;
        }

        public async Task<HelpEntity> GetAsync(HelperEntityType type)
        {
            return await _helpEntityRepository.GetFirstByPredicateAsync(x => x.Type == type);
        }
        
        public async Task<bool> CreateOrUpdateAsync(HelperEntityType type, string newValue)
        {
            var entity = await _helpEntityRepository.GetFirstByPredicateAsync(x => x.Type == type) ?? new HelpEntity
            {
                Type = type
            };
            entity.Value = newValue;
            if (entity.Id == 0)
            {
                await _helpEntityRepository.CreateAsync(entity);
            }
            else
            {
                await _helpEntityRepository.UpdateAsync(entity);
            }
            return true;
        }
    }
}
