import { Component, OnInit } from "@angular/core";
import { RoleGroup } from "../../model";
import { RoleGroupService } from "../../core/roleGroup.service";

@Component({
    selector: "roleGroup-list",
    templateUrl: "./roleGroup-list.component.html"
})
export class RoleGroupListComponent implements OnInit { 
    public items: RoleGroup[];

    constructor(private service: RoleGroupService) {
    }

    public ngOnInit(): void {
        this.update();
    }

    private update(): void {
        this.service
            .getAllWithRoles()
            .subscribe(data => this.items = data,
            e => console.log(e));
    }
}