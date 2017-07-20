import { Component } from "@angular/core";
import { RolesCheckedService, IRoles } from "../shared/index";

@Component({
    selector: "<navbar>",
    templateUrl: "./navbar.component.html"
})
export class NavbarComponent {
    public roles: IRoles;

    constructor(private rolesChecked: RolesCheckedService) {
        this.roles = this.rolesChecked.checkRoles();
    }
}