using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto.Polls;
using MyLiverpool.Data.Entities.Polls;
using MyLiverpool.Data.ResourceAccess.Interfaces;

namespace MyLiverpool.Business.Services
{
    public class PollService : IPollService
    {
        private readonly IGenericRepository<Poll> _pollRepository;
        private readonly IGenericRepository<PollAnswer> _pollAnswerRepository;
        private readonly IMapper _mapper;

        public PollService(IGenericRepository<Poll> pollRepository, IMapper mapper, IGenericRepository<PollAnswer> pollAnswerRepository)
        {
            _pollRepository = pollRepository;
            _mapper = mapper;
            _pollAnswerRepository = pollAnswerRepository;
        }

        public async Task<PollDto> CreateAsync(PollDto dto)
        {
            var model = _mapper.Map<Poll>(dto);
            model = await _pollRepository.CreateAsync(model);
            return _mapper.Map<PollDto>(model);
        }

        public async Task<PollDto> UpdateAsync(PollDto dto)
        {
            var model = _mapper.Map<Poll>(dto);
            var newAnswers = model.Answers;
            var oldAnswers = await _pollAnswerRepository.GetListAsync(filter: x => x.PollId == dto.Id);
            await UpdatePollAnswersAsync(oldAnswers, newAnswers);
            model.Answers = null;
            model = await _pollRepository.UpdateAsync(model);
            model.Answers = newAnswers;
            return _mapper.Map<PollDto>(model);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            await _pollRepository.DeleteAsync(x => x.Id == id);
            return true;
        }

        public async Task<PollDto> GetByIdAsync(int id)
        {
            var model = await _pollRepository.GetFirstByPredicateAsync(x => x.Id == id, true, x=> x.Include(p => p.Answers)); //todo load answers and count or inner load?
            return _mapper.Map<PollDto>(model);
        }

        public async Task<IEnumerable<PollDto>> GetListAsync()
        {
            var model = await _pollRepository.GetListAsync();
            return _mapper.Map<IEnumerable<PollDto>>(model);
        }

        private async Task UpdatePollAnswersAsync(IEnumerable<PollAnswer> oldAnswers, IEnumerable<PollAnswer> newAnswers)
        {
            foreach (var pollAnswer in GetAnswersToAdd(oldAnswers, newAnswers))
            {
                await _pollAnswerRepository.CreateAsync(pollAnswer);
            }

            await _pollAnswerRepository.UpdateRangeAsync(GetAnswersToUpdate(oldAnswers, newAnswers));
            await _pollAnswerRepository.DeleteRangeAsync(GetAnswersToDelete(oldAnswers, newAnswers));
        }

        private IEnumerable<PollAnswer> GetAnswersToDelete(IEnumerable<PollAnswer> oldAnswers, IEnumerable<PollAnswer> newAnswers)
        {
            return oldAnswers.Where(x => newAnswers.All(n => n.Id != x.Id));
        }

        private IEnumerable<PollAnswer> GetAnswersToAdd(IEnumerable<PollAnswer> oldAnswers, IEnumerable<PollAnswer> newAnswers)
        {
            return newAnswers.Where(x => oldAnswers.All(n => n.Id != x.Id));
        }

        private IEnumerable<PollAnswer> GetAnswersToUpdate(IEnumerable<PollAnswer> oldAnswers, IEnumerable<PollAnswer> newAnswers)
        {
            return newAnswers.Where(x => oldAnswers.Any(n => n.Id == x.Id));
        }
    }
}
