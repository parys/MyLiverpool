﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.DTO;
using MyLiverpool.Common.Utilities;
using MyLiverpool.Data.Entities;
using MyLiverpool.Data.ResourceAccess.Contracts;

namespace MyLiverpool.Business.Services.Services
{
    public class MatchService : BaseService, IMatchService
    {
        private readonly IClubService _clubService;
        public MatchService(IUnitOfWork unitOfWork, IMapper mapper, IClubService clubService) : base(unitOfWork, mapper)
        {
            _clubService = clubService;
        }

        public async Task<MatchDto> CreateAsync(MatchDto dto)
        {
            var match = _mapper.Map<Match>(dto);
            match.ClubId = await _clubService.GetIdByNameAsync(dto.ClubName);
            _unitOfWork.MatchRepository.Add(match);
            await _unitOfWork.SaveAsync();
            dto = _mapper.Map<MatchDto>(match);
            return dto;
        }

        public async Task<MatchDto> UpdateAsync(MatchDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<MatchDto> GetAsync(int id)
        {
            var match = await _unitOfWork.MatchRepository.GetByIdAsync(id);
            var dto = _mapper.Map<MatchDto>(match);
            return dto;
        }

        public async Task<PageableData<MatchDto>> GetListAsync(int page)
        {
            var clubs = await _unitOfWork.MatchRepository.GetAsync(page);
            var dtos = _mapper.Map<ICollection<MatchDto>>(clubs);
            var count = await _unitOfWork.MatchRepository.GetCountAsync();
            return new PageableData<MatchDto>(dtos, page, count);
        }
    }
}
