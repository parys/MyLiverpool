import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/index';
import { BreadcrumbService } from '@base/breadcrumbs';
import { ADMIN_ROUTE } from '@constants/index';

import { AdminHomeComponent } from '@admin/pages/admin-home/admin-home.component';
import { adminRoutes } from '@admin/admin.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(adminRoutes)
    ],
    declarations: [
        AdminHomeComponent
    ]
})
export class AdminModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${ADMIN_ROUTE}`, 'Админка');
//        this.breadcrumbService.hideRouteRegex(`^/${CLUBS_ROUTE}/[0-9]+$`);
    }
}
