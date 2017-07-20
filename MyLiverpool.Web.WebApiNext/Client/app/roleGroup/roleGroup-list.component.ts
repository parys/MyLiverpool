import { Component, OnInit } from "@angular/core";
import { RoleGroup } from "./roleGroup.model";
import { RoleGroupService } from "./roleGroup.service";
import { RolesCheckedService, IRoles } from "../shared/index";

@Component({
    selector: "roleGroup-list",
    templateUrl: "./roleGroup-list.component.html"
})
export class RoleGroupListComponent implements OnInit { 
    items: RoleGroup[];
    roles: IRoles;

    constructor(private service: RoleGroupService,
        private rolesChecked: RolesCheckedService) {
    }

    ngOnInit() {
        this.roles = this.rolesChecked.checkRoles();
        this.update();
    }

    private update(): void {
        this.service
            .getAllWithRoles()
            .subscribe(data => this.items = data,
            error => console.log(error));
    }
}