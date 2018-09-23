import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Subscription } from "rxjs";
import { User, UserService } from "@app/user";
import { RolesCheckedService } from "@app/+auth";
import { RoleGroupService, RoleGroup } from "@app/roleGroup";
import { CustomTitleService } from "@app/shared";

@Component({
    selector: "user-detail",
    templateUrl: "./user-detail.component.html"
})

export class UserDetailComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public item: User;
    public roleGroups: RoleGroup[];
    public roleForm: FormGroup;
    public banForm: FormGroup;
    public selectedUserId: number;
    public banDaysCount: number = 0;    

    constructor(
        private service: UserService,
        private route: ActivatedRoute,
        public roles: RolesCheckedService,
        private roleGroupService: RoleGroupService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private titleService: CustomTitleService) { }

    public ngOnInit(): void { 
        this.initRoleForm();
        this.initBanForm();
        this.sub = this.route.params.subscribe(params => {
            this.service.getSingle(+params["id"])
                .subscribe(data => this.parse(data),
                    e => console.log(e));
        });
        if (this.roles.userRoles.isAdminAssistant) {
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
                    this.snackBar.open("Группа изменена");
                } else {
                    this.snackBar.open("Группа НЕ изменена");
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
        const file = event.currentTarget.files[0];
        if (file) {
            if (file.size > 251 * 1024) {
                alert("Размер изображения не должен превышать 250КБ");
                return;
            }
            this.service.updateAvatar(file)
                .subscribe((result: any) => this.item.photo = `${result.path}?${Math.random()}`,
                    e => console.log(e));
        }
    }

    public resetAvatar(): void {
        this.service.resetAvatar(this.item.id)
            .subscribe((result: any) => this.item.photo = `${result.path}?${Math.random()}`,
            e => console.log(e));
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
        this.titleService.setTitle(item.userName);
        this.roleForm.patchValue(item);
    }

    private loadRoleGroups(): void {
        this.roleGroupService.getAll()
            .subscribe(data => this.roleGroups = data,
                e => console.log(e));
    }

    private initRoleForm(): void {
        this.roleForm = this.formBuilder.group({
            roleGroupId: ["", Validators.required]
        });
    }

    private initBanForm(): void {
        this.banForm = this.formBuilder.group({
            banDaysCount: ["", Validators.min(1)]
        });
    }
}