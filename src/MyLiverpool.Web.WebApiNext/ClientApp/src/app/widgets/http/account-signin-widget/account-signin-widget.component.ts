import { Component, OnInit, ChangeDetectionStrategy, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ACCOUNT_ROUTE } from '@constants/routes.constants';
import { ObserverComponent } from '@domain/base';

@Component({
    selector: 'account-signin-widget',
    templateUrl: './account-signin-widget.component.html',
    styleUrls: ['./account-signin-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AccountSigninWidgetComponent extends ObserverComponent implements OnInit {

    @Output() public signed = new EventEmitter();
    public loginForm: FormGroup;

    constructor(
                private formBuilder: FormBuilder,
                private snackBar: MatSnackBar,
                private router: Router) {
        super();
    }

    public ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // todo handle errors public onSubmit(): void {
    //     const login$ = this.authService.login(this.loginForm.value)
    //         .subscribe((data: any) => this.signed.emit(data),
    //             (e: any) => {
    //                 if (e.error === 'unconfirmed_email') {
    //                     this.router.navigate([`/${ACCOUNT_ROUTE}/unconfirmedEmail`]);
    //                     return;
    //                 }
    //                 if (e.error === 'invalid_grant' &&
    //                     e.error_description === 'The username/password couple is invalid.') {
    //                     this.snackBar.open('Неверный логин и/или пароль', null);
    //                 }
    //                 if (e.error === 'access_denied' && e.error_description === 'The user is locked out.') {
    //                     this.snackBar.open(
    //                         `Активность вашего аккаунта временно заблокирована за нарушение правил сайта до ${new
    //                         Date(e.expires_in)}.`,
    //                         null,
    //                         { duration: 65000 });
    //                 }
    //             });
    //     this.subscriptions.push(login$);
    // }
}
