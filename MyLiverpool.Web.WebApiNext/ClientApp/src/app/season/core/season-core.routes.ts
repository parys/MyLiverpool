import { Routes } from "@angular/router";
import { SEASONS_ROUTE } from "@app/+constants";

export const seasonCoreRoutes: Routes = [
    {
        path: SEASONS_ROUTE,
        loadChildren: "../lazy/season.module#SeasonModule"
    }
];