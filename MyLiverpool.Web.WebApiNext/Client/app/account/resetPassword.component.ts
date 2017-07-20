import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MdSnackBar } from "@angular/material";
import { Subscription } from "rxjs/Subscription";
import { AccountService } from "./account.service";
import { GlobalValidators } from "../shared/index";
import { ResetPassword } from "./resetPassword.model";

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

    constructor(private service: AccountService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MdSnackBar,
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
            'email': ["", Validators.compose([
                Validators.required, Validators.minLength(6), GlobalValidators.mailFormat])],
            'password': ["", Validators.compose([
                Validators.required, Validators.minLength(6)])],
            'confirmPassword': ["", Validators.compose([
                Validators.required, Validators.minLength(6)])],
        }, { validator: GlobalValidators.matchingPasswords("password", "confirmPassword") });
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
                    this.snackBar.open(`Ошибка: ${data.errors[0].description}`, null, { duration: 5000 });
                }
            },
            error => console.log(error)
        );
    }
}