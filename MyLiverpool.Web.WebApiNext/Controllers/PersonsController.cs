using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLfc.Common.Web;
using MyLfc.Common.Web.DistributedCache;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Common.Utilities.Extensions;
using MyLiverpool.Data.Common;
using Newtonsoft.Json;

namespace MyLiverpool.Web.WebApiNext.Controllers
{   
    /// <inheritdoc />
    /// <summary>
    /// Controller for manage persons.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class PersonsController : Controller
    {
        private readonly IPersonService _personService;
        private readonly IUploadService _uploadService;
        private readonly IDistributedCacheManager _cacheManager;

        /// <summary>
        /// Controller.
        /// </summary>
        /// <param name="personService"></param>
        /// <param name="uploadService"></param>
        /// <param name="cacheManager"></param>
        public PersonsController(IPersonService personService, IUploadService uploadService, IDistributedCacheManager cacheManager)
        {
            _personService = personService;
            _uploadService = uploadService;
            _cacheManager = cacheManager;
        }

        /// <summary>
        /// Creates new person item.
        /// </summary>
        /// <param name="dto">New person model.</param>
        /// <returns>Created model.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody]PersonDto dto)
        {
            if (dto == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _personService.CreateAsync(dto);
            _cacheManager.Remove(CacheKeysConstants.PersonBday + DateTime.Today);
            return Ok(result);
        }

        /// <summary>
        /// Returns pageable person list.
        /// </summary>
        /// <returns>Persons list.</returns>
        [AllowAnonymous, HttpGet("{filtersObj}")]
        public async Task<IActionResult> GetListAsync([FromRoute] string filtersObj)
        {
            PersonFiltersDto filters;
            if (filtersObj == null)
            {
                filters = GetBasicPersonFilters();
            }
            else
            {
                filters = (PersonFiltersDto)JsonConvert.DeserializeObject(filtersObj, typeof(PersonFiltersDto));
            }
            var result = await _personService.GetListAsync(filters);
            return Ok(result);
        }

        private PersonFiltersDto GetBasicPersonFilters()
        {
            return new PersonFiltersDto
            {
                Page = 1,
                Type = null
            };
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
            var result = await _personService.GetStuffListAsync(personType);
            return Ok(result);
        }

        /// <summary>
        /// Returns squad list.
        /// </summary>
        /// <returns>Persons list.</returns>
        [AllowAnonymous, HttpGet("squad")]
        public async Task<IActionResult> GetSquadListAsync([FromQuery]string type)
        {
            if (!Enum.TryParse(type, out PersonType squadType))
            {
                squadType = PersonType.First;
            }
            var result = await _personService.GetSquadListAsync(squadType);
            return Ok(result);
        }

        /// <summary>
        /// Returns person by id.
        /// </summary>
        /// <param name="id">The identifier of person.</param>
        /// <returns>Person.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            var result = await _personService.GetByIdAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// Returns best player.
        /// </summary>
        /// <returns>Best player dto.</returns>
        [AllowAnonymous, HttpGet("bestPlayer")]
        public async Task<IActionResult> GetBestPlayerAsync()
        {
            var result = await _cacheManager.GetOrCreateAsync(CacheKeysConstants.BestPlayerMemKey,
                async () => await _personService.GetBestPlayerAsync());
            return Ok(result);
        }

        /// <summary>
        /// Setups best player.
        /// </summary>
        /// <returns>True if setup successfully.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("bestPlayer/{personId:int}")]
        public async Task<IActionResult> SetBestPlayerAsync(int personId)
        {
            await _personService.SetBestPlayerAsync(personId);
            _cacheManager.Remove(CacheKeysConstants.BestPlayerMemKey);
            return Ok(true);
        }

        /// <summary>
        /// Returns persons list who celebrate birthday today.
        /// </summary>
        /// <returns>Persons who celebrates birthday today.</returns>
        [AllowAnonymous, HttpGet("birthdays")]
        public async Task<IActionResult> GetBirthdaysAsync()
        {
            var result = await _cacheManager.GetOrCreateAsync(CacheKeysConstants.PersonBday + DateTime.Today,
                async () => await _personService.GetBirthdaysAsync());
            return Json(result);
        }

        /// <summary>
        /// Updates person.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="dto">Modified person entity.</param>
        /// <returns>Result of editing.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("{id:int}")]
        public async Task<IActionResult> EditAsync(int id, [FromBody]PersonDto dto)
        {
            if (id != dto.Id || !ModelState.IsValid)
            {
                return BadRequest();
            }
            var result = await _personService.UpdateAsync(dto);
            _cacheManager.Remove(CacheKeysConstants.PersonBday + DateTime.Today);
            return Ok(result);
        }

        /// <summary>
        /// Deletes person.
        /// </summary>
        /// <param name="id">The identifier of deleting person.</param>
        /// <returns>Result of deleting.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _personService.DeleteAsync(id);
            return Ok(result);
        }

        /// <summary>
        /// Gets person types.
        /// </summary>
        /// <returns>Person types list.</returns>
        [AllowAnonymous, HttpGet("types")]
        public async Task<IActionResult> GetTypesAsync()
        {
            var list = new List<object>();
            foreach (PersonType type in Enum.GetValues(typeof(PersonType)))
            {
                list.Add(new { id = type, name = type.GetNameAttribute() });
            }

            return Ok(await Task.FromResult(list));
        }
        
        /// <summary>
        /// Uploads a person photo.
        /// </summary>
        /// <returns>Result of uploading new photo.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPost("photo/{name}")]
        public async Task<ActionResult> UploadPhotoAsync(string name)
        {
            if (Request.Form.Files != null && Request.Form.Files.Count > 0)
            {
                    var file = Request.Form.Files[0];
                    var result = await _uploadService.UpdatePersonPhotoAsync(name, file);

                    return Json(new { path = result });
            }
            return BadRequest();
        }

        /// <summary>
        /// Returns persons which names contain types string.
        /// </summary>
        /// <param name="typed">Part of person name for search.</param>
        /// <returns>List of keyValuePair of persons with identifiers.</returns>
        [AllowAnonymous, HttpGet("getPersonsByName")]
        public async Task<IActionResult> GetPersonsByNameAsync([FromQuery]string typed)
        {
            var result = await _personService.GetPersonsByNameAsync(typed);
            return Ok(result);
        }
    }
}
