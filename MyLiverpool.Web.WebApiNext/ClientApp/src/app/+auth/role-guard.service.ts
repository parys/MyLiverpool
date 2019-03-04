import { Injectable } from "@angular/core";
import { Location } from "@angular/common";
import { CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot } from "@angular/router";
import { RolesCheckedService } from "./roles-checked.service";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private rolesService: RolesCheckedService,
        private router: Router,
        private location: Location) { }

    public canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        if (this.rolesService.userRoles.isLogined) {
            const roles: string[] = route.data["role"] as Array<string>;
            if (roles == null || roles.length === 0) {
                return true;
            }

            for (let i: number = 0; i < roles.length; i++) {
                if (this.rolesService.isUserInRole(roles[i])) {
                    return true;
                }
            }
        }

        this.location.replaceState("/");
        this.router.navigate(["/"]);
        return false;
    }
}