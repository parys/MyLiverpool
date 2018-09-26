import { Routes } from "@angular/router";
import { PollEditComponent } from "./poll-edit.component";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { EDITING_RU } from "@app/+constants";

export const pollEditRoutes: Routes = [
    {
        path: "",
        component: PollEditComponent,
        data: {
            title: EDITING_RU,
            roles: [RolesEnum[RolesEnum.NewsStart], RolesEnum[RolesEnum.BlogStart]]
        },
        canActivate: [RoleGuard]
    }
];