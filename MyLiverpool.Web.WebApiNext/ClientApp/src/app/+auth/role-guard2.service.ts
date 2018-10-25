//import { Injectable } from "@angular/core";
//import { CanActivate, Router,
//    ActivatedRouteSnapshot,
//    RouterStateSnapshot } from "@angular/router";
//import { RolesCheckedService } from "./roles-checked.service";
//import { Observable } from 'rxjs';
//import { map } from 'rxjs/operators';

//import { OidcSecurityService } from 'angular-auth-oidc-client';

//@Injectable()
//export class RoleGuard2 implements CanActivate {
//    constructor(private rolesService: RolesCheckedService,
//        private oidcSecurityService: OidcSecurityService,
//        private router: Router) { }

//    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
//        console.log(route + '' + state);
//        console.log('AuthorizationGuard, canActivate');

//        return this.oidcSecurityService.getIsAuthorized().pipe(
//            map((isAuthorized: boolean) => {
//                console.log('AuthorizationGuard, canActivate isAuthorized: ' + isAuthorized);

//                if (isAuthorized) {
//                    const roles: string[] = route.data["role"] as Array<string>;
//                        if (roles == null || roles.length === 0) {
//                            return true;
//                        }

//                        for (let i: number = 0; i < roles.length; i++) {
//                            if (this.rolesService.isUserInRole(roles[i])) {
//                                return true;
//                            }
//                        }
//                    return true;
//                }

//                this.router.navigate(['/']);
//                return false;
//            })
//        );
//    }
//}