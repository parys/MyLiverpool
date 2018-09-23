import { Routes } from "@angular/router";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { MatchListComponent } from "./match-list";
import { MatchDetailComponent } from "./match-detail";
import { MatchEditComponent } from "./match-edit";
import { EDITING_RU, MATCHES_RU, MATCH_RU, EDIT_ROUTE } from "@app/+constants";

export const matchRoutes: Routes = [
    {
        path: "",
        component: MatchListComponent,
        data: {
            title: MATCHES_RU,
            roles: [RolesEnum[RolesEnum.InfoStart]]
        },
        canActivate: [RoleGuard]
    },
    {
        path: ":id",
        children: [
            {
                path: "",
                component: MatchDetailComponent,
                data: {
                    title: MATCH_RU
                }
            },
            {
                path: EDIT_ROUTE,
                component: MatchEditComponent,
                data: {
                    title: EDITING_RU,
                    roles: [RolesEnum[RolesEnum.InfoStart]]
                },
                canActivate: [RoleGuard]
            }
        ]
    }
];