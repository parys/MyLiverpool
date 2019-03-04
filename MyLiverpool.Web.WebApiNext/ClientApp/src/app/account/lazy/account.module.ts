import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatCheckboxModule } from "@angular/material";
import { SharedModule } from "@app/shared";
import { accountRoutes } from "./account.routes";
import { AccountSignupComponent } from "./account-signup";
import { ChangePasswordComponent } from "./changePassword";
import { ConfirmEmailComponent } from "./confirmEmail";
import { ForgotPasswordComponent } from "./forgotPassword";
import { ResetPasswordComponent } from "./resetPassword";
import { UnconfirmedEmailComponent } from "./unconfirmedEmail";
import { AccountValidators } from "./account.validators";
import { AccountCoreModule } from "../core";
import { RecaptchaModule } from "@app/shared/modules";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { AccountService } from "./account.service";
import { ACCOUNT_ROUTE } from "@app/+constants";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(accountRoutes),
        AccountCoreModule,
        RecaptchaModule,
        MatCheckboxModule
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
        this.breadcrumbService.addFriendlyNameForRoute(`/${ACCOUNT_ROUTE}/signup`, "Регистрация");
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${ACCOUNT_ROUTE}/confirmEmail`, "Подтверждение пароля");
        this.breadcrumbService.addFriendlyNameForRoute(`/${ACCOUNT_ROUTE}/forgotPassword`, "Восстановление забытого пароля");
        this.breadcrumbService.addFriendlyNameForRoute(`/${ACCOUNT_ROUTE}/unconfirmedEmail`, "Ваша почта не подтверждена");
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${ACCOUNT_ROUTE}/resetPassword`, "Сброс пароля");
        this.breadcrumbService.addFriendlyNameForRoute(`/${ACCOUNT_ROUTE}/changePassword`, "Изменение пароля");
    }
}