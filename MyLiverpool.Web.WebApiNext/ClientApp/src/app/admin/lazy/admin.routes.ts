import { Routes } from "@angular/router";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { AdminHomeComponent } from "./admin-home";

export const adminRoutes: Routes = [
    {
        path: "",
        component: AdminHomeComponent,
        data: { title: "Admin home", roles: [RolesEnum[RolesEnum.AdminStart]] },
        canActivate: [RoleGuard]
    },
    //{
    //    path: ":id/edit",
    //    component: ClubEditComponent,
    //    data: { title: EDIT_ROUTE, roles: [RolesEnum[RolesEnum.AdminStart]] },
    //    canActivate: [RoleGuard]
    //}
];