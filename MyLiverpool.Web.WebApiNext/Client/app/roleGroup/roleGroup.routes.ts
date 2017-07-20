import { Routes } from "@angular/router";
import { RoleGroupListComponent } from "./index";
import { RoleGuard } from "../auth/role-guard.service";

export const roleGroupRoutes: Routes = [
    {
        path: "roleGroups", children: [
            {
                path: "", component: RoleGroupListComponent, data: { title: "Группы и роли", roles: ["adminStart"] },
                canActivate: [RoleGuard] }
        ]
    }
];