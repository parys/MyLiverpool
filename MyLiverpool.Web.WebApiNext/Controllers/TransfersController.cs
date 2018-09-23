using System;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyLiverpool.Business.Contracts;
using MyLiverpool.Business.Dto;
using MyLiverpool.Business.Dto.Filters;
using MyLiverpool.Data.Common;
using Newtonsoft.Json;

namespace MyLiverpool.Web.WebApiNext.Controllers
{
    /// <summary>
    /// Manages transfers.
    /// </summary>
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme), Route("api/v1/[controller]")]
    public class TransfersController : Controller
    {
        private readonly ITransferService _transferService;

        /// <summary>
        /// Controller.
        /// </summary>
        /// <param name="transferService"></param>
        public TransfersController(ITransferService transferService)
        {
            _transferService = transferService;
        }

        /// <summary>
        /// Returns transfer by id.
        /// </summary>
        /// <param name="id">The identifier of transfer.</param>
        /// <returns>Found transfer by id.</returns>
        [AllowAnonymous, HttpGet("{id:int}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            var result = await _transferService.GetByIdAsync(id);
            return Json(result);
        }

        /// <summary>
        /// Returns transfers list.
        /// </summary>
        /// <returns>List with transfers.</returns>
        [AllowAnonymous, HttpGet]
        [Obsolete("Remove after 10.10.18")]
        public async Task<IActionResult> GetListAsync([FromQuery]int page)
        {
            var result = await _transferService.GetListAsync(page);
            return Json(result);
        }
        
        /// <summary>
        /// Returns filtered users list.
        /// </summary>
        /// <param name="dto">Filters.</param>
        /// <returns>List with users.</returns>
        [AllowAnonymous, HttpGet("{dto}")]
        public async Task<IActionResult> List(string dto)
        {
            if (string.IsNullOrWhiteSpace(dto))
            {
                return BadRequest();
            }
            var obj = JsonConvert.DeserializeObject<TransferFiltersDto>(dto, new JsonSerializerSettings() //todo should be application wide settings
            {
                MissingMemberHandling = MissingMemberHandling.Ignore,
                NullValueHandling = NullValueHandling.Include,
                DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate
            });

            var model = await _transferService.GetListAsync(obj);
            return Json(model);
        }

        /// <summary>
        /// Returns transfers list for current moment.
        /// </summary>
        /// <returns>List with transfers.</returns>
        [AllowAnonymous, HttpGet("current")]
        public async Task<IActionResult> GetCurrentListAsync()
        {
            var result = await _transferService.GetCurrentListAsync();
            return Json(result);
        }

        /// <summary>
        /// Creates new transfer.
        /// </summary>
        /// <param name="dto">Filled transfer model.</param>
        /// <returns>Created entity.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPost("")]
        public async Task<IActionResult> CreateAsync([FromBody]TransferDto dto)
        {
            if (dto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _transferService.CreateAsync(dto);
         //   RemoveCalendarFromCache();
            return Ok(result);
        }

        /// <summary>
        /// Updates transfer.
        /// </summary>
        /// <param name="id">The identifier of entity.</param>
        /// <param name="dto">Updated transfer dto.</param>
        /// <returns>Updated entity.</returns>
        [Authorize(Roles = nameof(RolesEnum.InfoStart)), HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody]TransferDto dto)
        {
            if (!ModelState.IsValid || id != dto.Id)
            {
                return BadRequest();
            }
            var result = await _transferService.UpdateAsync(dto);
          //  RemoveCalendarFromCache();
            return Ok(result);
        }
    }
}
