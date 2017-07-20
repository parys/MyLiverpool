import { Routes } from "@angular/router";
import { StadiumEditComponent } from "./stadium-edit.component"
import { StadiumListComponent } from "./stadium-list.component";
import { RoleGuard } from "../auth/index";

export const stadiumRoutes: Routes = [
    {
        path: "stadiums",
        children: [
            {
                path: "",
                component: StadiumListComponent,
                data: {
                    title: "Стадионы",
                    roles: ["infoStart"]
                },
                canActivate: [RoleGuard]
            },
            {
                path: ":id",
                children: [
                    {
                        path: "edit",
                        component: StadiumEditComponent,
                        data: {
                            title: "Редактирование стадиона",
                            roles: ["infoStart"]
                        },
                        canActivate: [RoleGuard]
                    }
                ]
            }
        ]
    }
];