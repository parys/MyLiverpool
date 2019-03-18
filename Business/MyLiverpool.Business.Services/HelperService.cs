using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
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
        private static List<Regex> _rudWordsRegexes;

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

        public async Task<string> SanitizeRudWordsAsync(string message)
        {
            if (_rudWordsRegexes == null)
            {
                await LoadRudWordsAsync();
            }

            foreach (var regex in _rudWordsRegexes)
            {
                message = regex.Replace(message, string.Empty);
            }

            return message;
        }

        private async Task LoadRudWordsAsync()
        {
            _rudWordsRegexes = new List<Regex>();
            var words = (await GetAsync(HelperEntityType.RudWords))?.Value?
                .Replace(" ", "")?.Split(",", StringSplitOptions.RemoveEmptyEntries);
            if (words != null)
            {
                foreach (var word in words)
                {
                    _rudWordsRegexes.Add(new Regex($"/{word}/igm", RegexOptions.Compiled));
                }
            }
        }
    }
}
