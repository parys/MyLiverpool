import { Routes } from "@angular/router";
import { MaterialCategoryListComponent } from "./materialCategory-list";
import { MaterialCategoryEditComponent } from "./materialCategory-edit";
import { RoleGuard, RolesEnum } from "@app/+auth";

export const materialCategoryRoutes: Routes = [
    { path: "", component: MaterialCategoryListComponent },
    {
        path: ":id/edit",
        component: MaterialCategoryEditComponent,
        data: { roles: [RolesEnum[RolesEnum.NewsFull], RolesEnum[RolesEnum.BlogFull]] },
        canActivate: [RoleGuard]
    }
];