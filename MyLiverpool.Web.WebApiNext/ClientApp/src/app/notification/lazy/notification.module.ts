import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@app/shared";
import { notificationRoutes } from "./notification.routes";
import { NotificationListComponent } from "./notification-list";
import { NotificationCoreModule } from "@app/notification";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { NOTIFICATIONS_ROUTE } from "@app/+constants";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(notificationRoutes),
        SharedModule,
        NotificationCoreModule
    ],
    declarations: [
        NotificationListComponent
    ]
})
export class NotificationModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRoute(`/${NOTIFICATIONS_ROUTE}`, "Уведомления");
    }
}