import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { AuthService } from "@app/+auth";
import { ACCOUNT_ROUTE } from "@app/+constants";

@Component({
    selector: "account-signin",
    templateUrl: "./account-signin.component.html",
    styleUrls: ["./account-signin.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AccountSigninComponent implements OnInit {
    public loginForm: FormGroup;

    constructor(private authService: AuthService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router) {
    }

    public ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: ["", Validators.required],
            password: ["", Validators.required]
        });
    }

    public onSubmit(): void {
        this.authService.login(this.loginForm.value)
            .subscribe((data: any) => data,
                (e: any) => {
                    if (e.error === "unconfirmed_email") {
                        this.router.navigate([`/${ACCOUNT_ROUTE}/unconfirmedEmail`]);
                        return;
                    }
                    if (e.error === "invalid_grant" &&
                        e.error_description === "The username/password couple is invalid.") {
                        this.snackBar.open("Неверный логин и/или пароль", null);
                    }
                    if (e.error === "access_denied" && e.error_description === "The user is locked out.") {
                        this.snackBar.open(
                            `Активность вашего аккаунта временно заблокирована за нарушение правил сайта до ${new
                            Date(e.expires_in)}.`,
                            null,
                            { duration: 65000 });
                    }
                });
    }
}