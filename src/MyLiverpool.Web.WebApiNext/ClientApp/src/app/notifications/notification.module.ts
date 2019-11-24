import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/index';
import { BreadcrumbService } from '@base/breadcrumbs';
import { NOTIFICATIONS_ROUTE } from '@constants/routes.constants';

import { notificationRoutes } from './notification.routes';
import { NotificationListComponent } from './pages/notification-list';
import { NotificationService } from './notification.service';
import { PipesModule } from '@base/pipes';
import { NotificationMaterialModule } from './notification-material.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(notificationRoutes),
        SharedModule,
        PipesModule,
        NotificationMaterialModule,
    ],
    declarations: [
        NotificationListComponent
    ],
    providers: [
        NotificationService
    ]
})
export class NotificationModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRoute(`/${NOTIFICATIONS_ROUTE}`, 'Уведомления');
    }
}
