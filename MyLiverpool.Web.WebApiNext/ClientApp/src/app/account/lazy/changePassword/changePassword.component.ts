import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AccountService } from "../account.service";
import { ChangePassword } from "../../model";
import { MatSnackBar } from "@angular/material";
import { AccountValidators } from "../account.validators";

@Component({
    selector: "change-password",
    templateUrl: "./changePassword.component.html"
})

export class ChangePasswordComponent implements OnInit {
    public passwordForm: FormGroup;
    public isHuman: boolean = false;

    constructor(private service: AccountService,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.passwordForm = this.formBuilder.group({
            oldPassword: ["", Validators.compose([
                Validators.required, Validators.minLength(6)])],
            newPassword: ["", Validators.compose([
                Validators.required, Validators.minLength(6)])],
            confirmPassword: ["", Validators.compose([
                Validators.required, Validators.minLength(6)])]
        }, { validator: AccountValidators.matchingPasswords("newPassword", "confirmPassword") });
    }

    public onSubmit(): void {
        const model: ChangePassword = this.passwordForm.value;

        this.service.changePassword(model).subscribe(data => {
            if (data) {
                this.snackBar.open("Пароль изменен.");
            } else {
                this.snackBar.open("Пароль НЕ изменен.");
            }
            },
            error => {
                this.snackBar.open("Пароль НЕ изменен.");
            });
        this.isHuman = false;
    }
}