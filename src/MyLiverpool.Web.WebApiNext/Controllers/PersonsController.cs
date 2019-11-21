using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Application.Persons;
using MyLfc.Common.Web;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;

namespace MyLiverpool.Web.WebApiNext.Controllers
{   
    /// <inheritdoc />
    /// <summary>
    /// Controller for manage persons.
    /// </summary>
    public class PersonsController : BaseController
    {
        /// <summary>
        /// Creates new person item.
        /// </summary>
        /// <param name="request">New person model.</param>
        /// <returns>Created model.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody]CreatePersonCommand.Request request)
        {
            var result = await Mediator.Send(request);
            CacheManager.Remove(CacheKeysConstants.PersonBday + DateTime.Today);
            return Ok(result);
        }

        /// <summary>
        /// Returns pageable person list.
        /// </summary>
        /// <returns>Persons list.</returns>
        [AllowAnonymous, HttpGet("")]
        public async Task<IActionResult> GetListAsync([FromQuery] GetPersonListQuery.Request request)
        {
            return Ok(await Mediator.Send(request));
        }

        /// <summary>
        /// Returns stuff list.
        /// </summary>
        /// <returns>Persons list.</returns>
        [AllowAnonymous, HttpGet("stuff")]
        public async Task<IActionResult> GetStuffListAsync([FromQuery]string type)
        {
            if (!Enum.TryParse(type, out PersonType personType))
            {
                personType = PersonType.Stuff;
            }
            else
            {
                personType = personType == PersonType.First ? PersonType.Stuff : PersonType.StuffAcademy;
            }

            return Ok((await Mediator.Send(new GetStuffListQuery.Request {Type = personType})).Results);
        }

        /// <summary>
        /// Returns squad list.
        /// </summary>
        /// <returns>Persons list.</returns>
        [AllowAnonymous, HttpGet("squad")]
        public async Task<IActionResult> GetSquadListAsync([FromQuery]GetSquadListQuery.Request request)
        {
            return Ok(await Mediator.Send(request));
        }

        /// <summary>
        /// Returns person by id.
        /// </summary>
        /// <param name="request">The identifier of person.</param>
        /// <returns>Person.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync([FromRoute] GetPersonDetailQuery.Request request)
        {
            return Ok(await Mediator.Send(request));
        }

        /// <summary>
        /// Returns best player.
        /// </summary>
        /// <returns>Best player dto.</returns>
        [AllowAnonymous, HttpGet("bestPlayer")]
        public async Task<IActionResult> GetBestPlayerAsync()
        {
            var result = await CacheManager.GetOrCreateAsync(CacheKeysConstants.BestPlayerMemKey,
                async () => await Mediator.Send(new GetBestPlayerQuery.Request()));
            return Ok(result);
        }

        // <summary>
        // Setups best player.
        // </summary>
        // <returns>True if setup successfully.</returns>
        //[Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("bestPlayer/{personId:int}")]
        //public async Task<IActionResult> SetBestPlayerAsync(int personId)
        //{
        //    await _personService.SetBestPlayerAsync(personId);
        //    _cacheManager.Remove(CacheKeysConstants.BestPlayerMemKey);
        //    return Ok(true);
        //}

        /// <summary>
        /// Returns persons list who celebrate birthday today.
        /// </summary>
        /// <returns>Persons who celebrates birthday today.</returns>
        [AllowAnonymous, HttpGet("birthdays")]
        public async Task<IActionResult> GetBirthdaysAsync()
        {
            var result = await CacheManager.GetOrCreateAsync(CacheKeysConstants.PersonBday + DateTime.Today,
                async () => await Mediator.Send(new GetPersonBirthdaysQuery.Request()));
            return Ok(result.Results);
        }

        /// <summary>
        /// Updates person.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="request">Modified person entity.</param>
        /// <returns>Result of editing.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("{id:int}")]
        public async Task<IActionResult> EditAsync([FromRoute]int id, [FromBody]UpdatePersonCommand.Request request)
        {
            if (id != request.Id)
            {
                return BadRequest();
            }
            var result = await Mediator.Send(request);
            CacheManager.Remove(CacheKeysConstants.PersonBday + DateTime.Today);
            return Ok(result);
        }

        /// <summary>
        /// Deletes person.
        /// </summary>
        /// <param name="request">The identifier of deleting person.</param>
        /// <returns>Result of deleting.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] DeletePersonCommand.Request request)
        {
            var result = await Mediator.Send(request);
            return Ok(result.Id);
        }

        /// <summary>
        /// Gets person types.
        /// </summary>
        /// <returns>Person types list.</returns>
        [AllowAnonymous, HttpGet("types")]
        [ResponseCache(Duration = 10800)]
        public async Task<IActionResult> GetTypesAsync()
        {
            var list = new List<object>();
            foreach (PersonType type in Enum.GetValues(typeof(PersonType)))
            {
                list.Add(new { id = type, name = type.GetNameAttribute() });
            }

            return Ok(await Task.FromResult(list));
        }
    }
}
