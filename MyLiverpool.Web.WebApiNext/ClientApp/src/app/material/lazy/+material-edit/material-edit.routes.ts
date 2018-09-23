import { Routes } from "@angular/router";
import { MaterialEditComponent } from "./material-edit.component";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { MaterialLeaveGuard } from "./leave-guard/leave-guard.service";
import { EDITING_RU } from "@app/+constants";

export const materialEditRoutes: Routes = [
    {
        path: "",
        component: MaterialEditComponent,
        data: {
            title: EDITING_RU,
            roles: [RolesEnum[RolesEnum.NewsStart], RolesEnum[RolesEnum.BlogStart]]
        },
        canActivate: [RoleGuard],
        canDeactivate: [MaterialLeaveGuard]
    }
];