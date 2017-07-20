import { Routes } from "@angular/router";
import { UserDetailComponent, UserListComponent, UserConfigComponent, UserEditComponent } from "./index";
import { RoleGuard } from "../auth/index";

export const userRoutes: Routes = [
    {
        path: "users",
        children: [
            { path: "", component: UserListComponent, data: { title: "Пользователи" } },
            {
                path: ":id",
                children: [
                    { path: "", component: UserDetailComponent, data: { title: "Пользователь" } },
                    { path: "settings", component: UserConfigComponent, data: { title: "Настройки" }, canActivate: [RoleGuard] },
                    { path: "edit", component: UserEditComponent, data: { title: "Редактирование" }, canActivate: [RoleGuard] }
                ]
            }
        ]
    }
];  