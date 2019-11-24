import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

import { SharedModule } from '@shared/index';
import { accountRoutes } from './account.routes';
import { AccountSignupComponent } from './account-signup';
import { ChangePasswordComponent } from './changePassword';
import { ConfirmEmailComponent } from './confirmEmail';
import { ForgotPasswordComponent } from './forgotPassword';
import { ResetPasswordComponent } from './resetPassword';
import { UnconfirmedEmailComponent } from './unconfirmedEmail';
import { AccountValidators } from './account.validators';
import { AccountCoreModule } from '../core';
import { RecaptchaModule } from '@widgets/recaptcha';
import { BreadcrumbService } from '@base/breadcrumbs';
import { AccountService } from './account.service';
import { ACCOUNT_ROUTE } from '@constants/index';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(accountRoutes),
        AccountCoreModule,
        RecaptchaModule,
        MatCheckboxModule,
        MatInputModule,
        MatButtonModule
    ],
    declarations: [
        AccountSignupComponent,
        ChangePasswordComponent,
        ConfirmEmailComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        UnconfirmedEmailComponent,
  //      AccountInitComponent
    ],
    providers: [
        AccountValidators,
        AccountService
    ],
    bootstrap: [
  //      AccountInitComponent
    ]
})
export class AccountModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.hideRouteRegex(`^/${ACCOUNT_ROUTE}$`);
        this.breadcrumbService.addFriendlyNameForRoute(`/${ACCOUNT_ROUTE}/signup`, 'Регистрация');
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${ACCOUNT_ROUTE}/confirmEmail`, 'Подтверждение пароля');
        this.breadcrumbService.addFriendlyNameForRoute(`/${ACCOUNT_ROUTE}/forgotPassword`, 'Восстановление забытого пароля');
        this.breadcrumbService.addFriendlyNameForRoute(`/${ACCOUNT_ROUTE}/unconfirmedEmail`, 'Ваша почта не подтверждена');
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${ACCOUNT_ROUTE}/resetPassword`, 'Сброс пароля');
        this.breadcrumbService.addFriendlyNameForRoute(`/${ACCOUNT_ROUTE}/changePassword`, 'Изменение пароля');
    }
}
