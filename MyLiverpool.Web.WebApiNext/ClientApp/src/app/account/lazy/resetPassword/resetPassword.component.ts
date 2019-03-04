import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { Subscription } from "rxjs";
import { AccountService } from "../account.service";
import { ResetPassword } from "../../model";
import { AccountValidators } from "../account.validators";

@Component({
    selector: "reset-password",
    templateUrl: "./resetPassword.component.html"
})

export class ResetPasswordComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public resetForm: FormGroup;
    public finish: boolean;
    public error: boolean = false;
    public code: string;
    public isHuman: boolean = false;

    constructor(private service: AccountService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["code"]) {
                this.code = params["code"];
            } else {
                this.router.navigate(["/"]);
            }

        });
        this.resetForm = this.formBuilder.group({
            email: ["", Validators.compose([
                Validators.required, Validators.minLength(6), Validators.email])],
            password: ["", Validators.compose([
                Validators.required, Validators.minLength(6)])],
            confirmPassword: ["", Validators.compose([
                Validators.required, Validators.minLength(6)])],
        }, { validator: AccountValidators.matchingPasswords("password", "confirmPassword") });
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
    }

    public onSubmit(): void {
        const resetPassword: ResetPassword = this.resetForm.value;
        resetPassword.code = this.code;
        this.service.resetPassword(resetPassword).subscribe(data => {
                this.error = !data.succeeded;
                this.finish = data.succeeded;
                if (!data.succeeded) {
                    this.snackBar.open(`Ошибка: ${data.errors[0].description}`, null);
                }
            });
        this.isHuman = false;
    }
}