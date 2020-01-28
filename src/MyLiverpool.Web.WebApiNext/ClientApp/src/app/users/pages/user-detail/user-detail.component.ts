import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RolesCheckedService } from '@base/auth';
import { User, RoleGroup} from '@domain/models';
import { RoleGroupService } from '@role-groups/index';
import { CustomTitleMetaService as CustomTitleService } from '@shared/index';

import { UserService } from '@users/user.service';
import { ObserverComponent } from '@domain/base';

@Component({
    selector: 'user-detail',
    templateUrl: './user-detail.component.html'
})

export class UserDetailComponent extends ObserverComponent implements OnInit {
    public item: User;
    public roleGroups: RoleGroup[];
    public roleForm: FormGroup;
    public banForm: FormGroup;
    public selectedUserId: number;
    public banDaysCount = 0;

    constructor(
        private service: UserService,
        private route: ActivatedRoute,
        public roles: RolesCheckedService,
        private roleGroupService: RoleGroupService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router,
        private location: Location,
        private titleService: CustomTitleService) {
        super();
    }

    public ngOnInit(): void {
        this.initRoleForm();
        this.initBanForm();
        const sub = this.route.params.subscribe(params => {
            this.service.getSingle(+params['id'])
                .subscribe((data: User) => this.parse(data));
        });
        this.subscriptions.push(sub);

        if (this.roles.isAdminAssistant) {
            this.loadRoleGroups();
        }
    }    

    public onSubmit(): void {
        const roleGroupId = this.roleForm.controls['roleGroupId'].value;
        const sub = this.service.updateRoleGroup(this.item.id, roleGroupId)
            .subscribe((data: boolean) => {
                if (data) {
                    this.roleForm.patchValue(roleGroupId);
                    this.snackBar.open('Группа изменена');
                } else {
                    this.snackBar.open('Группа НЕ изменена');
                }
            });

        this.subscriptions.push(sub);
    }

    public onSubmitBan(): void {
        const banDaysCount = this.banForm.controls['banDaysCount'].value;
        const sub = this.service.ban(this.item.id, banDaysCount)
            .subscribe((data: boolean) => {
                if (data) {
                    const time = new Date();
                    this.item.lockoutEnd = new Date(time.setHours(time.getHours() + banDaysCount * 24 * 60 * 60));
                    this.banForm.controls['banDaysCount'].patchValue(null);
                }
            });

        this.subscriptions.push(sub);
    }

    public onChangeAvatar(event: any): void {
        const file = event.currentTarget.files[0];
        if (file) {
            if (file.size > 251 * 1024) {
                alert('Размер изображения не должен превышать 250КБ');
                return;
            }
            const sub = this.service.updateAvatar(file)
                .subscribe((result: any) => this.item.photo = `${result.path}?${Math.random()}`);
            this.subscriptions.push(sub);
        }
    }

    public resetAvatar(): void {
        const sub = this.service.resetAvatar(this.item.id)
            .subscribe((result: any) => this.item.photo = `${result.path}?${Math.random()}`);
        this.subscriptions.push(sub);
    }

    public unban(): void {
        const sub = this.service.unban(this.item.id)
            .subscribe((data: boolean) => {
                if (data) {
                    this.item.lockoutEnd = null;
                }
            });
        this.subscriptions.push(sub);
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
        this.location.go(this.router.createUrlTree(['users', item.id]).toString());
    }

    private loadRoleGroups(): void {
        const sub = this.roleGroupService.getAll()
            .subscribe((data: RoleGroup[]) => this.roleGroups = data);
        this.subscriptions.push(sub);
    }

    private initRoleForm(): void {
        this.roleForm = this.formBuilder.group({
            roleGroupId: ['', Validators.required]
        });
    }

    private initBanForm(): void {
        this.banForm = this.formBuilder.group({
            banDaysCount: ['', Validators.min(1)]
        });
    }
}
