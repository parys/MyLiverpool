import { Routes } from "@angular/router";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { RoleGroupListComponent } from "./roleGroup-list";

export const roleGroupRoutes: Routes = [
    {
        path: "",
        component: RoleGroupListComponent,
        data: {
            title: "Группы и роли",
            roles: [RolesEnum[RolesEnum.AdminStart]]
        },
        canActivate: [RoleGuard]
    }
];