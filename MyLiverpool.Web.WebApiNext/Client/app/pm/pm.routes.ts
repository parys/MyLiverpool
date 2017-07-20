import { Routes } from "@angular/router";
import { PmListComponent, PmDetailComponent, PmEditComponent } from "./index";
import { RoleGuard } from "../auth/index";

export const pmRoutes: Routes = [
    { path: "pms", children: [
            { path: "", component: PmListComponent, data: { title: "Личные сообщения" }, canActivate: [RoleGuard] },
            { path: ":id", children: [
                    { path: "", component: PmDetailComponent, data: { title: "Личное сообщение" }, canActivate: [RoleGuard] },
                    { path: "edit", component: PmEditComponent, data: { title: "Написание личного сообщения" }, canActivate: [RoleGuard] }
                ]
            }
        ]
    }
];