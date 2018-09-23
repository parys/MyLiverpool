import { Routes } from "@angular/router";
import { TransferEditComponent } from "./transfer-edit";
import { TransferListComponent } from "./transfer-list";
import { TransferCurrentListComponent } from "./transfer-current-list";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { EDITING_RU, TRANSFERS_RU } from "@app/+constants";

export const transferRoutes: Routes = [
    {
        path: "",
        component: TransferListComponent,
        data: {
            title: TRANSFERS_RU,
            roles: [RolesEnum[RolesEnum.InfoStart]]
        },
        canActivate: [RoleGuard]
    },
    {
        path: ":id/edit",
        component: TransferEditComponent,
        data: {
            title: EDITING_RU,
            roles: [RolesEnum[RolesEnum.InfoStart]]
        },
        canActivate: [RoleGuard]
    },
    {
        path: "current",
        component: TransferCurrentListComponent,
        data: {
            title: TRANSFERS_RU
        }
    }
];