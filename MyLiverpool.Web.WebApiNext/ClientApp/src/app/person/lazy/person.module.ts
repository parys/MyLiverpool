import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PersonListComponent } from "./person-list";
import { StuffListComponent } from "./stuff-list";
import { SquadComponent } from "./squad";
import { personRoutes } from "./person.routes";
import { SharedModule } from "@app/shared";
import { PersonCoreModule } from "../core";
import { MatTabsModule, MatTableModule } from "@angular/material";
import { PersonEditModule } from "../core/+person-edit";
import { PersonDetailComponent } from "./person-detail";
import { BreadcrumbService } from "../../shared/breadcrumb";
import { PERSONS_ROUTE, STUFF_ROUTE, SQUAD_ROUTE } from "@app/+constants";


@NgModule({
    imports: [
        RouterModule.forChild(personRoutes),
        SharedModule,
        PersonCoreModule,
        PersonEditModule,
        MatTabsModule,
        MatTableModule
    ],
    declarations: [
        PersonListComponent,
        SquadComponent,
        StuffListComponent,
        PersonDetailComponent
    ]
})
export class PersonModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${PERSONS_ROUTE}`, "Люди");
        this.breadcrumbService.hideRouteRegex(`^/${PERSONS_ROUTE}/[0-9]+$`); // this.addCallbackForRouteRegex("^/news/[0-9]+$", this.getTitle);
        //   this.addFriendlyNameForRouteRegex("^/persons/[0-9]+/edit$", "Редактирование");
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${STUFF_ROUTE}`, "Тренерский штаб");
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${STUFF_ROUTE}/first`, "Первая команда");
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${STUFF_ROUTE}/academy`, "Академия");
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${SQUAD_ROUTE}`, "Состав");
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${SQUAD_ROUTE}/first`, "Первая команда");
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${SQUAD_ROUTE}/academy`, "Академия");
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${SQUAD_ROUTE}/loan`, "В аренде");
    }
}