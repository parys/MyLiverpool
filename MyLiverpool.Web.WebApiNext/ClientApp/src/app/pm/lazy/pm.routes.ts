import { Routes } from "@angular/router";
import { RoleGuard } from "@app/+auth";
import { PmListComponent } from "./pm-list";
import { PmDetailComponent } from "./pm-detail";
import { PmEditComponent } from "./pm-edit";
import { EDIT_ROUTE } from "@app/+constants";

export const pmRoutes: Routes = [
    { path: "", component: PmListComponent, data: { title: "Личные сообщения" }, canActivate: [RoleGuard] },
    {
        path: ":id",
        children: [
            { path: "", component: PmDetailComponent, data: { title: "Cообщение" }, canActivate: [RoleGuard] },
            {
                path: EDIT_ROUTE,
                component: PmEditComponent,
                data: { title: "Написание личного сообщения" },
                canActivate: [RoleGuard]
            }
        ]
    }
];