import { Routes } from '@angular/router';
import { UnSignedGuard, RoleGuard } from '@app/+auth';
import { AccountSignupComponent } from './account-signup';
import { ConfirmEmailComponent } from './confirmEmail';
import { ForgotPasswordComponent } from './forgotPassword';
import { UnconfirmedEmailComponent } from './unconfirmedEmail';
import { ResetPasswordComponent } from './resetPassword';
import { ChangePasswordComponent } from './changePassword';

export const accountRoutes: Routes = [
    {
        path: 'signup',
        component: AccountSignupComponent,
        data: { title: 'Регистрация' },
        canActivate: [UnSignedGuard]
    },
    {
        path: 'confirmEmail',
        component: ConfirmEmailComponent,
        data: { title: 'Подтверждение пароля' }
    },
    {
        path: 'forgotPassword',
        component: ForgotPasswordComponent,
        data: { title: 'Восстановление забытого пароля' },
        canActivate: [UnSignedGuard]
    },
    {
        path: 'unconfirmedEmail',
        component: UnconfirmedEmailComponent,
        data: { title: 'Ваша почта не подтверждена' }
    },
    {
        path: 'resetPassword',
        component: ResetPasswordComponent,
        data: { title: 'Сброс пароля' },
        canActivate: [UnSignedGuard]
    },
    {
        path: 'changePassword',
        component: ChangePasswordComponent,
        data: { title: 'Изменение пароля' },
        canActivate: [RoleGuard]
    }
];
