import { Injectable } from "@angular/core";
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import { RolesCheckedService } from "./roles-checked.service";
import { NEWS_ROUTE } from "../+constants/routes.constants";

@Injectable()
export class UnSignedGuard implements CanActivate {
    constructor(private rolesService: RolesCheckedService, private router: Router) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.rolesService.isLogined) {
            this.router.navigate([NEWS_ROUTE]);              //bug need to go to root
             return false;
        }
        return true;
    }
}