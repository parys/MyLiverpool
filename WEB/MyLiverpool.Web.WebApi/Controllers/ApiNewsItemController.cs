﻿using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.AspNet.Identity;
using MyLiverpool.Business.DTO;
using MyLiverpoolSite.Business.Contracts;
using MyLiverpoolSite.Data.DataAccessLayer;
using MyLiverpoolSite.Data.Entities;

namespace MyLiverpool.Web.WebApi.Controllers
{
    [RoutePrefix("api/News")]
    public class ApiNewsItemsController : ApiController
    {
        private readonly INewsService _newsService;
        private readonly INewsCategoryService _newsCategoryService;

        public ApiNewsItemsController(INewsService newsService, INewsCategoryService newsCategoryService)
        {
            _newsService = newsService;
            _newsCategoryService = newsCategoryService;
        }

        [Route("List")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<PageableData<NewsMiniDto>> GetNewsItems(int page = 1, int? categoryId = null)
        {
            return await _newsService.GetDtoAllAsync(page, categoryId);
        }

        [Route("Info")]
        [HttpGet]
        [AllowAnonymous]
        [ResponseType(typeof(NewsItemDto))]
        public async Task<IHttpActionResult> GetNewsItem(int id)
        {
            var model = await _newsService.GetDtoAsync(id);
            return Ok(model);
        }

        [Route("Delete")]
        [HttpDelete]
        [Authorize(Roles = "NewsStart")]
        public async Task<IHttpActionResult> Delete(int? id)
        {
            if (!id.HasValue)
            {
                return BadRequest();
            }

            var result = await _newsService.DeleteAsync(id.Value, User.Identity.GetUserId<int>());
            return Json(result);
        }

        [Route("Activate")]
        [HttpPut]
        [Authorize(Roles = "NewsFull")]
        public async Task<IHttpActionResult> Activate(int? id)
        {
            if (!id.HasValue)
            {
                return BadRequest();
            }
            var result = await _newsService.ActivateAsync(id.Value);
            return Json(result);
        }

        [Route("Categories")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<IHttpActionResult> Categories()
        {
            var result = await _newsCategoryService.GetCategoriesDtoAsync();
            return Ok(result);
        }

        [Route("Create")]
        [HttpPost]
        [Authorize(Roles = "NewsStart")]
        public async Task<IHttpActionResult> Create(NewsItemDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!User.IsInRole(RolesEnum.NewsFull.ToString()))
            {
                model.Pending = true;
            }
            var result = await _newsService.CreateAsync(model, User.Identity.GetUserId<int>());
            return Ok(result);
        }

        [Route("Edit")]
        [HttpPut]
        [Authorize(Roles = "NewsStart")]
        public async Task<IHttpActionResult> Edit(NewsItemDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            if (!User.IsInRole(RolesEnum.NewsFull.ToString()))
            {
                if (model.AuthorId != User.Identity.GetUserId<int>())
                {
                    return Unauthorized();
                }
                model.Pending = true;
            }
            var result = await _newsService.EditAsync(model, User.Identity.GetUserId<int>());
            return Ok(result);
        }

        [Route("AddView")]
        [HttpPut]
        [AllowAnonymous]
        public async Task<IHttpActionResult> AddView(int? id)
        {
            if (!id.HasValue)
            {
                return BadRequest();
            }
            var result = await _newsService.AddViewAsync(id.Value);
            return Ok(result);
        }
    }
}