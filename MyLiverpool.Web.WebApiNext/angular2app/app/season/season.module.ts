﻿import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { seasonRoutes } from "./season.routes";
import { SeasonService } from "./season.service";
import { SeasonCalendarComponent } from "./season-calendar";
import { SeasonEditComponent } from "./season-edit";
import { SeasonListComponent } from "./season-list";
import { SeasonStatisticsComponent } from "./season-statistics";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(seasonRoutes)
    ],
    declarations: [
        SeasonCalendarComponent,
        SeasonEditComponent,
        SeasonListComponent,
        SeasonStatisticsComponent
    ],
    exports: [
    ],
    providers: [
        SeasonService
    ]
})
export class SeasonModule { }