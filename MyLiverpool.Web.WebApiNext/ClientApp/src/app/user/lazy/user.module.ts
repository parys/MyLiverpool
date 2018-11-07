import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { userRoutes } from "./user.routes";
import { UserEditComponent } from "./user-edit";
import { UserListComponent } from "./user-list";
import { UserCoreModule } from "@app/user";
import { UserDetailComponent } from "./user-detail";
import { UserConfigComponent } from "./user-config";
import { RoleGroupCoreModule } from "@app/roleGroup";
import { MatNativeDateModule, MatDatepickerModule, MatInputModule, MatTableModule, MatSelectModule } from "@angular/material";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { USERS_ROUTE, USERS_RU, USER_RU } from "@app/+constants";
//import { SignalRModule } from "@app/+signalr";

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
        MatSelectModule

     //   SignalRModule
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
        this.breadcrumbService.addFriendlyNameForRouteRegex(`^/${USERS_ROUTE}/[0-9]+/settings$`, "Настройки");
    }
}