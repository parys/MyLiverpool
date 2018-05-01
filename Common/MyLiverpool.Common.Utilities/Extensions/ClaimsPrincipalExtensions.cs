﻿using System;
using System.Security.Claims;

namespace MyLiverpool.Common.Utilities.Extensions
{
    /// <summary>
    /// Contains claim extensions.
    /// </summary>
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// Returns user id.
        /// </summary>
        /// <param name="principal">Claims principal</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public static int GetUserId(this ClaimsPrincipal principal)
        {
            if (principal == null)
                throw new ArgumentNullException(nameof(principal));
           // var claim = principal.Claims.FirstOrDefault(x => x.Value == "sub");//FindFirst(ClaimTypes.WindowsSubAuthority);
            var claim = principal.FindFirst("sub");
            if (claim != null)
            {
                return int.Parse(claim.Value);
            }
            throw new UnauthorizedAccessException("problem with getUserId");
        }

        public static int GetIdSafe(this ClaimsPrincipal principal)
        {
            ;
            // var claim = principal.Claims.FirstOrDefault(x => x.Value == "sub");//FindFirst(ClaimTypes.WindowsSubAuthority);
            var claim = principal?.FindFirst("sub");
            if (claim != null)
            {
                return int.Parse(claim.Value);
            }

            return 0;
        }
    }
}
