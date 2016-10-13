﻿import { Component, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth/auth.service";
import { RolesCheckedService } from "./shared/roles-checked.service";
import { IRoles } from "./shared/roles.interface";

@Component({
    selector: "my-app",
    templateUrl: "app/app.component.html"
})

export class AppComponent {
    roles: IRoles;
    private viewContainerRef: ViewContainerRef;

    constructor(private router: Router, public auth: AuthService, private rolesChecked: RolesCheckedService, viewContainerRef: ViewContainerRef) { //todo need to more elegant decision
        this.roles = this.rolesChecked.checkedRoles;
        // You need this small hack in order to catch application root view container ref
        this.viewContainerRef = viewContainerRef;
    }

    logout() {
        this.auth.logout();
    }
}