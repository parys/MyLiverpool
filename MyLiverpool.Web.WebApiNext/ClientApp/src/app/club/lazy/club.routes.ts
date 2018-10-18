import { Routes } from "@angular/router";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { ClubListComponent } from "./club-list";
import { ClubEditComponent } from "./club-edit";
import { CLUBS_RU, EDIT_ROUTE } from "@app/+constants";
import { RoleGuard2 } from "../../+auth/role-guard2.service";

export const clubRoutes: Routes = [
    {
        path: "",
        component: ClubListComponent,
        data: { title: CLUBS_RU },//todo roles: [RolesEnum[RolesEnum.AdminStart]] },
        canActivate: [RoleGuard2]
    },
    {
        path: ":id/edit",
        component: ClubEditComponent,
        data: { title: EDIT_ROUTE, roles: [RolesEnum[RolesEnum.AdminStart]] },
        canActivate: [RoleGuard2]
    }
];