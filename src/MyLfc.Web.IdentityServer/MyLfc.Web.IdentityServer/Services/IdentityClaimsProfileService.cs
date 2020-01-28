using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyLfc.Domain;
using MyLfc.Persistence;
using MyLiverpool.Data.ResourceAccess.Repositories;

namespace MyLfc.Web.IdentityServer.Services
{
    public class IdentityClaimsProfileService : IProfileService
    {
        private readonly IUserClaimsPrincipalFactory<User> _claimsFactory;
        private readonly LiverpoolContext _context;

        public IdentityClaimsProfileService(LiverpoolContext context, IUserClaimsPrincipalFactory<User> claimsFactory)
        {
            _context = context;
            _claimsFactory = claimsFactory;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = int.Parse(context.Subject.GetSubjectId());
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == sub);
            var principal = await _claimsFactory.CreateAsync(user);

            var claims = principal.Claims.ToList();
            claims = claims.Where(claim => context.RequestedClaimTypes.Contains(claim.Type)).ToList();
         //   claims.Add(new Claim("userName", user.UserName));

            var roles = await (from userRole in _context.UserRoles
                join role in _context.Roles on userRole.RoleId equals role.Id
                where userRole.UserId.Equals(sub)
                select role.Name).ToListAsync();
        //    claims.Add(new Claim(IdentityServerConstants.StandardScopes.Email, user.Email));
            // note: to dynamically add roles (ie. for users other than consumers - simply look them up by sub id
            foreach (var role in roles)
            {
                claims.Add(new Claim("role", role));
            }
          //   // need this for role-based authorization - https://stackoverflow.com/questions/40844310/role-based-authorization-with-identityserver4

            context.IssuedClaims = claims;
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var sub = context.Subject.GetSubjectId();
            context.IsActive = await _context.Users.AnyAsync(x => x.Id == int.Parse(sub));
        }
    }
}
