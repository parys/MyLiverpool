import { Routes } from "@angular/router";
import { StadiumEditComponent } from "./stadium-edit"
import { StadiumListComponent } from "./stadium-list";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { EDIT_ROUTE } from "@app/+constants/routes.constants";
import { EDITING_RU } from "@app/+constants/ru.constants";

export const stadiumRoutes: Routes = [
    {
        path: "",
        component: StadiumListComponent,
        data: {
            title: "Стадионы",
            roles: [RolesEnum[RolesEnum.InfoStart]]
        },
        canActivate: [RoleGuard]
    },
    {
        path: ":id",
        children: [
            {
                path: EDIT_ROUTE,
                component: StadiumEditComponent,
                data: {
                    title: EDITING_RU,
                    roles: [RolesEnum[RolesEnum.InfoStart]]
                },
                canActivate: [RoleGuard]
            }
        ]
    }
];