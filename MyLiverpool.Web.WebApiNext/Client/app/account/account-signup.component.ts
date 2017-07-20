import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IRegisterModel } from "../auth/models/register-model";
import { AccountService } from "./account.service";
import { GlobalValidators } from "../shared/index";
import { AccountValidators } from "./account.validators";
import { AuthService } from "../auth/auth.service";

@Component({
    selector: "account-signup",
    templateUrl: "./account-signup.component.html"
})

export class AccountSignupComponent implements OnInit {
    public registerForm: FormGroup;
    public result: boolean = false;
    public isHuman: boolean = false;

    constructor(private accountService: AccountService,
        private authService: AuthService,
        private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            'userName': ["", Validators.compose([
                Validators.required,
                Validators.minLength(3)
            ]), new AccountValidators(this.accountService).isUserNameUnique],
            'email': ["", Validators.compose([
                Validators.required,
                Validators.minLength(6),
                GlobalValidators.mailFormat
            ]),
                new AccountValidators(this.accountService).isEmailUnique],
            'password': ["", Validators.compose([
                Validators.required, Validators.minLength(6)])],
            'confirmPassword': ["", Validators.compose([
                Validators.required, Validators.minLength(6)])]
        }, { validator: GlobalValidators.matchingPasswords("password", "confirmPassword") });                      
    }

    public onSubmit(): void {
        const signup: IRegisterModel = this.registerForm.value;

        this.authService
            .register(signup)
            .subscribe(data => {
                    if (data) {
                        this.result = true;
                    }
                },
            error => console.log(error));
        this.isHuman = false;
    }
}