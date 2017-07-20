import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MdSnackBar } from "@angular/material";
import { Subscription } from "rxjs/Subscription";
import { Configuration } from "../app.constants";
import { User } from "./user.model";                          
import { UserService } from "./user.service";
import { GlobalValidators, RolesCheckedService, IRoles, LocalStorageService } from "../shared/index";
import { RoleGroupService, RoleGroup } from "../roleGroup/index";

@Component({
    selector: "user-detail",
    templateUrl: "./user-detail.component.html"
})

export class UserDetailComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    item: User;
    roles: IRoles;
    roleGroups: RoleGroup[];
    roleForm: FormGroup;
    banForm: FormGroup;
    selectedUserId: number;
    banDaysCount: number = 0;              

    constructor(private configuration: Configuration,
        private storage: LocalStorageService,
        private service: UserService,
        private route: ActivatedRoute,
        private rolesChecked: RolesCheckedService,
        private roleGroupService: RoleGroupService,
        private formBuilder: FormBuilder,
        private snackBar: MdSnackBar,
        private router: Router) { }

    public ngOnInit(): void {
        this.roles = this.rolesChecked.checkRoles();      
        this.initRoleForm();
        this.initBanForm();
        this.sub = this.route.params.subscribe(params => {
            if (params["id"] !== undefined) {
                this.service.getSingle(+params["id"])
                    .subscribe(data => this.parse(data),
                        error => console.log(error),
                        () => {});
            } else {
                this.router.navigate(["/user", { page: 1 }]);
            }
        });
        if (this.roles.isAdminAssistant) {
            this.loadRoleGroups();
        }
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
    }

    public onSubmit(): void {
        let roleGroupId = this.roleForm.controls["roleGroupId"].value;
        this.service.updateRoleGroup(this.item.id, roleGroupId)
            .subscribe(data => {
                if (data) {
                    this.roleForm.patchValue(roleGroupId);
                    this.snackBar.open("Группа была успешно изменена", null, { duration: 5000 });
                } else {
                    this.snackBar.open("Не удалось изменить группу", null, { duration: 5000 });
                }
            });
    }

    public onSubmitBan(): void {
        let banDaysCount = this.banForm.controls["banDaysCount"].value;
        this.service.ban(this.item.id, banDaysCount)
            .subscribe(data => {
                if (data) {
                    let time = new Date();
                    this.item.lockoutEnd = new Date(time.setHours(time.getHours() + banDaysCount * 24 * 60 * 60));
                    this.banForm.controls["banDaysCount"].patchValue(null);
                }
            });
    }

    public onChangeAvatar(event: any): void {
        let file = event.currentTarget.files[0];
        if (file) {
            this.service.updateAvatar(file)
                .subscribe(result => this.item.photo = `${result}#${Math.random()}`,
                    error => console.log(error),
                    () => {});
        }
    }

    public resetAvatar(): void {
        this.service.resetAvatar(this.item.id)
            .subscribe(result => this.item.photo = `${result}#${Math.random()}`,
            error => console.log(error),
            () => {});
    }

    public unban(): void {
        this.service.unban(this.item.id)
            .subscribe(data => {
                if (data) {               
                    this.item.lockoutEnd = null;                            
                }
            });
    }

    public writePm(): void {
        this.selectedUserId = this.item.id;
    }

    public closePmWindow(event: any): void {
        this.selectedUserId = null;
    }

    private parse(item: User): void {
        this.item = item;
        this.roleForm.patchValue(item);
    }

    private loadRoleGroups(): void {
        this.roleGroupService.getAll()
            .subscribe(data => this.roleGroups = data,
                error => console.log(error),
                () => {});
    }

    private initRoleForm(): void {
        this.roleForm = this.formBuilder.group({
            'roleGroupId': ["", Validators.required]
        });
    }

    private initBanForm(): void {
        this.banForm = this.formBuilder.group({
            'banDaysCount': [
                "", Validators.compose([
                    Validators.required,
                    GlobalValidators.mustBeGreaterThanZero
                ])
            ]
        });
    }
}