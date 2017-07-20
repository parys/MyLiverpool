import { Component, OnInit } from "@angular/core";
import { ForumSectionService } from "./forumSection.service";
import { ForumSection } from "./forumSection.model";
import { RolesCheckedService, IRoles } from "../../shared/index";

@Component({
    selector: "forumSection-list",
    templateUrl: "./forumSection-list.component.html"
})

export class ForumSectionListComponent implements OnInit {

    items: ForumSection[];//add subscr
    roles: IRoles;

    constructor(private service: ForumSectionService, private rolesChecked: RolesCheckedService) {
    }

    ngOnInit() {
        this.roles = this.rolesChecked.checkRoles();
        
        this.service
            .getAll()
            .subscribe(data => this.items = data,
            error => console.log(error));
    }
}