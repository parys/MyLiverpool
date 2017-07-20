import { Routes } from "@angular/router";
import { PageEditorComponent } from "./index";
import { RoleGuard } from "../auth/index";

export const helperRoutes: Routes = [
    {
        path: "editPage",
        children: [
            { path: "", pathMatch: "full", redirectTo: "/" },
            {
                path: ":id",
                component: PageEditorComponent,
                data: {
                    title: "Редактирование страницы",
                    roles: ["adminStart", "infoStart"]
                },
                canActivate: [RoleGuard]
            }
        ]
    }
];