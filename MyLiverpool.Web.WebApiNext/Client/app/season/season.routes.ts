import { Routes } from "@angular/router";
import { SeasonEplTableComponent } from "./season-eplTable.component";
import { SeasonListComponent } from "./season-list.component";
import { SeasonEditComponent } from "./season-edit.component";
import { SeasonCalendarComponent } from "./season-calendar.component";
import { RoleGuard } from "../auth/index";

export const seasonRoutes: Routes = [
    {
        path: "seasons",
        children: [
            { path: "", component: SeasonListComponent, data: { title: "Список сезонов" } },
            { path: "eplTable", component: SeasonEplTableComponent, data: { title: "Таблица АПЛ" } },
            {
                path: ":id/edit",
                component: SeasonEditComponent,
                data: {
                     title: "Редактирование сезона",
                     roles: ["infoStart"]
                },
                canActivate: [RoleGuard]
            },
            { path: "calendar", component: SeasonCalendarComponent, data: { title: "Календарь" } }
        ]
    }
];