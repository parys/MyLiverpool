import { Component } from "@angular/core";
import { RolesCheckedService, IRoles } from "../shared/index";
import { AuthService } from "../auth/index";

@Component({
    selector: "sidebar-right",
    templateUrl: "./sidebar-right.component.html"
})
export class SidebarRightComponent {
    public roles: IRoles;

    constructor(private rolesChecked: RolesCheckedService,
        private authService: AuthService) {
        this.roles = this.rolesChecked.checkRoles();
    }

    public logout(): void {
        this.authService.logout();
    }
}