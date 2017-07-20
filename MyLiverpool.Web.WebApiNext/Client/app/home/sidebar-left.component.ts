import { Component } from "@angular/core";
import { RolesCheckedService, IRoles } from "../shared/index";
import { AuthService } from "../auth/index";

@Component({
    selector: "sidebar-left",
    templateUrl: "./sidebar-left.component.html"
})
export class SidebarLeftComponent {
    public roles: IRoles;

    constructor(private rolesChecked: RolesCheckedService,
        private authService: AuthService) {
        this.roles = this.rolesChecked.checkRoles();
    }

    public logout(): void {
        this.authService.logout();
    }
}