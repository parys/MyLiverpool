import { Injectable } from "@angular/core";
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import { RolesCheckedService } from "../shared/index";

@Injectable()
export class UnSignedGuard implements CanActivate {
    constructor(private rolesService: RolesCheckedService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.rolesService.checkRoles().isLogined) {
            this.router.navigate(["/news"]);              //bug need to go to root
             return false;
        }
        return true;
    }
}