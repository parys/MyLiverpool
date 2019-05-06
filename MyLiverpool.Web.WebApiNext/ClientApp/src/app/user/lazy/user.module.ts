import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared';
import { userRoutes } from './user.routes';
import { UserEditComponent } from './user-edit';
import { UserListComponent } from './user-list';
import { UserCoreModule } from '@app/user';
import { UserDetailComponent } from './user-detail';
import { UserConfigComponent } from './user-config';
import { RoleGroupCoreModule } from '@app/roleGroup';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbService } from '@app/shared/breadcrumb';
import { USERS_ROUTE, USERS_RU, USER_RU } from '@app/+constants';
import { PmSharedModule } from '@app/pm/shared';

@NgModule({
    imports: [
        SharedModule,
        UserCoreModule,
        RouterModule.forChild(userRoutes),
        RoleGroupCoreModule,
        MatNativeDateModule,
        MatInputModule,
        MatDatepickerModule,
        MatTableModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSortModule,
        PmSharedModule
    ],
    declarations: [
        UserDetailComponent,
        UserConfigComponent,
        UserEditComponent,
        UserListComponent
    ]
})
export class UserModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${USERS_ROUTE}`, USERS_RU);
        this.breadcrumbService.addFriendlyNameForRouteRegex(`^/${USERS_ROUTE}/[0-9]+$`, USER_RU);
        this.breadcrumbService.addFriendlyNameForRouteRegex(`^/${USERS_ROUTE}/[0-9]+/settings$`, 'Настройки');
    }
}
