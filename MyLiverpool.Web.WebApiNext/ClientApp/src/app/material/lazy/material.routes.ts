import { Routes } from "@angular/router";
import { MaterialDetailComponent } from "./material-detail";
import { MaterialListComponent } from "../core";
import { EDIT_ROUTE } from "@app/+constants/";
import { CanLoadEditMaterial } from "./canLoadEdit.guard";

export const materialRoutes: Routes = [
    {
        path: "",
        component: MaterialListComponent
    },
    {
        path: ":id",
        children: [
            {
                path: "",
                component: MaterialDetailComponent
            },
            {
                path: EDIT_ROUTE,
                loadChildren: "./+material-edit/material-edit.module#MaterialEditModule",
                canLoad: [CanLoadEditMaterial]
            }
        ]
    }
];