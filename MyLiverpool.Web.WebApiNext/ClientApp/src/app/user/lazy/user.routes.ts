import { Routes } from "@angular/router";
import { RoleGuard } from "@app/+auth";
import { UserDetailComponent } from "./user-detail";
import { UserListComponent } from "./user-list";
import { UserConfigComponent } from "./user-config";
import { UserEditComponent } from "./user-edit";
import { USERS_RU, EDITING_RU, USER_RU } from "../../+constants/ru.constants";
import { EDIT_ROUTE } from "../../+constants/routes.constants";

export const userRoutes: Routes = [
    { path: "", component: UserListComponent, data: { title: USERS_RU } },
    {
        path: ":id",
        children: [
            { path: "", component: UserDetailComponent, data: { title: USER_RU } },
            {
                path: "settings",
                component: UserConfigComponent,
                data: { title: "Настройки" },
                canActivate: [RoleGuard]
            },
            {
                path: EDIT_ROUTE,
                component: UserEditComponent,
                data: { title: EDITING_RU },
                canActivate: [RoleGuard]
            }
        ]
    }
];