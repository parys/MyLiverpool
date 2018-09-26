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
import { MatNativeDateModule, MatDatepickerModule, MatInputModule } from "@angular/material";
//import { SignalRModule } from "@app/+signalr";

@NgModule({
    imports: [
        SharedModule,
        UserCoreModule,
        RouterModule.forChild(userRoutes),
        RoleGroupCoreModule,
        MatNativeDateModule,
        MatInputModule,
        MatDatepickerModule

     //   SignalRModule
    ],
    declarations: [
        UserDetailComponent,
        UserConfigComponent,
        UserEditComponent,
        UserListComponent
    ]
})
export class UserModule { }