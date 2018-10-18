import { Injectable } from "@angular/core";
import { Location } from "@angular/common";
import { CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot } from "@angular/router";
import { RolesCheckedService } from "./roles-checked.service";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class RoleGuard2 implements CanActivate {
    constructor(private rolesService: RolesCheckedService,
        private oidcSecurityService: OidcSecurityService,
        private router: Router,
        private location: Location) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        console.log(route + '' + state);
        console.log('AuthorizationGuard, canActivate');

        return this.oidcSecurityService.getIsAuthorized().pipe(
            map((isAuthorized: boolean) => {
                console.log('AuthorizationGuard, canActivate isAuthorized: ' + isAuthorized);

                if (isAuthorized) {
                    return true;
                }

                this.router.navigate(['/unauthorized']);
                return false;
            })
        );
    }
    //public canActivate(route: ActivatedRouteSnapshot,
    //    state: RouterStateSnapshot): boolean {
    //    if (!this.rolesService.userRoles.isLogined) {
    //        this.location.replaceState("/");
    //        this.router.navigate(["/"]);
    //         return false;
    //    }

    //    const roles: string[] = route.data["role"] as Array<string>;
    //    if (roles == null || roles.length === 0) {
    //        return true;
    //    }

    //    for (let i: number = 0; i < roles.length; i++) {
    //        if (this.rolesService.isUserInRole(roles[i])) {
    //            return true;
    //        }
    //    }

    //    this.location.replaceState("/");
    //    this.router.navigate(["/"]);
    //    return false;
    //}
}