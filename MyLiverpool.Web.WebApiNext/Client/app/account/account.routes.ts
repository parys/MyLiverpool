import { Routes } from "@angular/router";
import {
    AccountSignupComponent,
    ConfirmEmailComponent,
    ForgotPasswordComponent,
    UnconfirmedEmailComponent,
    ResetPasswordComponent,
    ChangePasswordComponent
} from "./index";
import { UnSignedGuard, RoleGuard } from "../auth/index";

export const accountRoutes: Routes = [
    {
        path: "signup",
        component: AccountSignupComponent,
        data: { title: "Регистрация" },
        canActivate: [UnSignedGuard]
    },
    {
        path: "confirmEmail",
        component: ConfirmEmailComponent,
        data: { title: "Подтверждение пароля" }
    },
    {
        path: "forgotPassword",
        component: ForgotPasswordComponent,
        data: { title: "Восстановление забытого пароля" },
        canActivate: [UnSignedGuard]
    },
    {
        path: "unconfirmedEmail",
        component: UnconfirmedEmailComponent,
        data: { title: "Ваша почта не подтверждена" }
    },
    {
        path: "resetPassword",
        component: ResetPasswordComponent,
        data: { title: "Сброс пароля" },
        canActivate: [UnSignedGuard]
    },
    {
        path: "changePassword",
        component: ChangePasswordComponent,
        data: { title: "Изменение пароля" },
        canActivate: [RoleGuard]
    }
];