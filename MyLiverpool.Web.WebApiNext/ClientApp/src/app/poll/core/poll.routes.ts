import { Routes } from "@angular/router";
import { POLLS_ROUTE } from "@app/+constants";

export const pollCoreRoutes: Routes = [
    {
        path: POLLS_ROUTE,
        loadChildren: "../lazy/poll.module#PollModule"
    },
];