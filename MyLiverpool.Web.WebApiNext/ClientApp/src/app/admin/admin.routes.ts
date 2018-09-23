import { Routes } from "@angular/router";
import { PageEditorComponent } from "./page-editor";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { EDITING_RU } from "@app/+constants/ru.constants";

export const helperRoutes: Routes = [
    {
        path: "editPage",
        children: [
            { path: "", pathMatch: "full", redirectTo: "/" },
            {
                path: ":id",
                component: PageEditorComponent,
                data: {
                    title: EDITING_RU,
                    roles: [RolesEnum[RolesEnum.AdminStart], RolesEnum[RolesEnum.InfoStart]]
                },
                canActivate: [RoleGuard]
            }
        ]
    }
];