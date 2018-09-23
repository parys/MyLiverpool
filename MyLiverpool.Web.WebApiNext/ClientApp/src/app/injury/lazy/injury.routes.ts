import { Routes } from "@angular/router";
import { InjuryEditComponent } from "./injury-edit";
import { InjuryListComponent } from "./injury-list";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { EDITING_RU, INJURIES_RU } from "@app/+constants";

export const injuryRoutes: Routes = [
    {
        path: "",
        component: InjuryListComponent,
        data: {
            title: INJURIES_RU,
            roles: [RolesEnum[RolesEnum.InfoStart]]
        },
        canActivate: [RoleGuard]
    },
    {
        path: ":id/edit",
        component: InjuryEditComponent,
        data: {
            title: EDITING_RU,
            roles: [RolesEnum[RolesEnum.InfoStart]]
        },
        canActivate: [RoleGuard]
    }
];