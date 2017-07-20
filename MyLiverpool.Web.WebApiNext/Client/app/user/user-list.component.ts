import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";  
import { FormBuilder, FormGroup } from "@angular/forms";  
import { ActivatedRoute } from "@angular/router";
import { User} from "./user.model";
import { UserService } from "./user.service";
import { RoleGroupService } from "../roleGroup/roleGroup.service";
import { RoleGroup } from "../roleGroup/roleGroup.model";
import { UserFilters } from "./userFilters.model";
import { Pageable, RolesCheckedService, IRoles } from "../shared/index";

@
Component({
    selector: "user-list",
    templateUrl: "./user-list.component.html"
})

export class UserListComponent implements OnInit {
    items: User[];
    roles: IRoles;
    roleGroups: RoleGroup[];
    filterForm: FormGroup;
    page: number = 1;
    itemsPerPage: number = 15;
    totalItems: number;
    //userName: string;
    selectedUserId: number;

    constructor(private userService: UserService,
        private location: Location,
        private roleGroupService: RoleGroupService,
        private rolesChecked: RolesCheckedService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.roles = this.rolesChecked.checkRoles();
        this.page = +this.route.snapshot.queryParams["page"] || 1;
        let userName = this.route.snapshot.queryParams["userName"] || "";
        let roleGroupId = this.route.snapshot.queryParams["roleGroupId"] || "";
        this.updateRoleGroups();
        this.initFilterForm(userName, roleGroupId);
        this.update();
    }

    writePm(index: number): void {
        this.selectedUserId = index;
    }

    closePmWindow(event: any): void {
        this.selectedUserId = null;
    }

    pageChanged(event: any): void {
        this.page = event;
        this.update();
    };

    update(): void {
        let filters = new UserFilters();
        filters.userName = this.filterForm.get("userName").value;
        filters.roleGroupId = this.filterForm.get("roleGroupId").value;
        filters.page = this.page;

        this.userService
            .getAll(filters)
            .subscribe(data => this.parsePageable(data),
            error => console.log(error),
            () => { this.updateUrl()});
    }

    private updateUrl(): void {
        let newUrl = `users?page=${this.page}`;

        let userName = this.filterForm.get("userName").value;
        if (userName) {
            newUrl = `${newUrl}&userName=${userName}`;
        }
        let roleGroupId = this.filterForm.get("roleGroupId").value;
        if (roleGroupId) {
            newUrl = `${newUrl}&roleGroupId=${roleGroupId}`;
        }

        this.location.replaceState(newUrl);
    }

    private parsePageable(pageable: Pageable<User>): void {
        this.items = pageable.list;
        this.page = pageable.pageNo;
        this.itemsPerPage = pageable.itemPerPage;
        this.totalItems = pageable.totalItems;
    }

    private updateRoleGroups() {
        this.roleGroupService.getAll().subscribe(data => this.roleGroups = data,
            error => console.log(error));
    }

    private initFilterForm(userName: string, roleGroupId: string) {
        this.filterForm = this.formBuilder.group({
            'roleGroupId': [roleGroupId],
            'userName': [userName]
        });
    }
}