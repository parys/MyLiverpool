import { Routes } from "@angular/router";
import { ClubListComponent, ClubEditComponent } from "./index";
import { RoleGuard } from "../auth/index";

export const clubRoutes: Routes = [
    {
        path: "clubs",
        children: [
            {
                path: "",
                component: ClubListComponent,
                data: { title: "Клубы", roles: ["adminStart"] },
                canActivate: [RoleGuard]
            },
            {
                path: ":id/edit",
                component: ClubEditComponent,
                data: { title: "Создание клуба", roles: ["adminStart"] },
                canActivate: [RoleGuard]
            }
        ]
    }
];