import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MdSnackBar } from "@angular/material";
import { Subscription } from "rxjs/Subscription";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Component({
    selector: "user-edit",
    templateUrl: "./user-edit.component.html"
})

export class UserEditComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public userEditForm: FormGroup;

    constructor(private service: UserService,
        private formBuilder: FormBuilder,
        private snackBar: MdSnackBar) { }

    public ngOnInit(): void {
        this.initUserEditForm();
        this.sub = this.service.getSingle(0)
            .subscribe(data => this.parse(data),
                error => console.log(error));
    }

    public ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
    }

    public onSubmit(): void {
        const user: User = this.userEditForm.value;
        user.birthday = new Date(user.birthday);
        user.birthday = new Date(user.birthday.setHours(user.birthday.getHours() + (-1) * user.birthday.getTimezoneOffset() / 60));
        this.service.update(user)
            .subscribe(data => {
                if (data) {
                    this.snackBar.open("Профиль был успешно изменен", null, { duration: 5000 });
                } else {
                    this.snackBar.open("Не удалось сохранить настройки", null, { duration: 5000 });
                }
            });
    }

    private parse(item: User): void {
        this.userEditForm.patchValue(item);
    }

    private initUserEditForm(): void {
        this.userEditForm = this.formBuilder.group({
            'birthday': [""],
            'fullName': [""],
            'gender': ["", Validators.required]
        });
    }
}