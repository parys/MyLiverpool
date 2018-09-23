import { Routes } from "@angular/router";
import { SeasonListComponent } from "./season-list";
import { SeasonEditComponent } from "./season-edit";
import { SeasonCalendarComponent } from "./season-calendar";
import { RoleGuard, RolesEnum } from "@app/+auth";
import { SeasonStatisticsComponent } from "./season-statistics";
import { CALENDAR_RU, STATISTICS_RU, EDITING_RU } from "@app/+constants";
import { EDIT_ROUTE } from "@app/+constants";

export const seasonRoutes: Routes = [
    { path: "", component: SeasonListComponent, data: { title: "Список сезонов" } },
    {
        path: ":id",
        children: [
            {
                path: EDIT_ROUTE,
                component: SeasonEditComponent,
                data: {
                    title: EDITING_RU,
                    roles: [RolesEnum[RolesEnum.InfoStart]]
                },
                canActivate: [RoleGuard]
            },
            { path: "calendar", component: SeasonCalendarComponent, data: { title: CALENDAR_RU } },
            { path: "statistics", component: SeasonStatisticsComponent, data: { title: STATISTICS_RU } },
        ]
    }
];