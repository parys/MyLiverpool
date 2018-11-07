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
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { CALENDAR_RU, SEASONS_ROUTE, STATISTICS_RU } from "@app/+constants";
import { MatSelectModule } from "@angular/material";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(seasonRoutes),
        SeasonCoreModule,
        MatSelectModule
    ],
    declarations: [
        SeasonCalendarComponent,
        SeasonEditComponent,
        SeasonListComponent,
        SeasonStatisticsComponent,
        SeasonStatisticsItemComponent
    ]
})
export class SeasonModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${SEASONS_ROUTE}`, "Сезоны");
        this.breadcrumbService.addFriendlyNameForRoute(`/${SEASONS_ROUTE}/calendar`, CALENDAR_RU);
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${SEASONS_ROUTE}/[0-9]+/calendar`, CALENDAR_RU);
        this.breadcrumbService.addFriendlyNameForRoute(`/${SEASONS_ROUTE}/statistics`, STATISTICS_RU);
        this.breadcrumbService.hideRouteRegex(`^/${SEASONS_ROUTE}/[0-9]+$`);
    }
}