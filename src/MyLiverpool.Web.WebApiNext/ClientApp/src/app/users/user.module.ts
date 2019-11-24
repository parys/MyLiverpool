import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/index';
import { RoleGroupCoreModule } from '@role-groups/core';
import { BreadcrumbService } from '@base/breadcrumbs';
import { USERS_ROUTE } from '@constants/routes.constants';
import { PmSharedModule } from '@pms/shared';
import { PipesModule } from '@base/pipes';
import { userRoutes } from './user.routes';
import { UserEditComponent } from '@users/pages/user-edit';
import { UserListComponent } from '@users/pages/user-list';
import { UserService } from '@users/user.service';
import { UserDetailComponent } from '@users/pages/user-detail';
import { UserConfigComponent } from '@users/pages/user-config';
import { USERS_RU, USER_RU } from '@constants/ru.constants';
import { UserMaterialModule } from './user-material.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(userRoutes),
        RoleGroupCoreModule,
        PmSharedModule,
        PipesModule,
        UserMaterialModule,
        MatButtonModule
    ],
    declarations: [
        UserDetailComponent,
        UserConfigComponent,
        UserEditComponent,
        UserListComponent
    ],
    providers: [
        UserService
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
