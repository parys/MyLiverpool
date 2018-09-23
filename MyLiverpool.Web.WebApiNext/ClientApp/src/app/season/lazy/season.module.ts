import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { seasonRoutes } from "./season.routes";
import { SeasonCoreModule } from "../core";
import { SeasonCalendarComponent } from "./season-calendar";
import { SeasonEditComponent } from "./season-edit";
import { SeasonListComponent } from "./season-list";
import { SeasonStatisticsComponent } from "./season-statistics";
import { SeasonStatisticsItemComponent } from "./season-statistics-item";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(seasonRoutes),
        SeasonCoreModule
    ],
    declarations: [
        SeasonCalendarComponent,
        SeasonEditComponent,
        SeasonListComponent,
        SeasonStatisticsComponent,
        SeasonStatisticsItemComponent
    ]
})
export class SeasonModule { }