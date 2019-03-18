import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { AdminHomeComponent } from "./admin-home/admin-home.component";
import { adminRoutes } from "./admin.routes";
import { ADMIN_ROUTE } from "@app/+constants";

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
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${ADMIN_ROUTE}`, "Админка");
//        this.breadcrumbService.hideRouteRegex(`^/${CLUBS_ROUTE}/[0-9]+$`); 
    }
}