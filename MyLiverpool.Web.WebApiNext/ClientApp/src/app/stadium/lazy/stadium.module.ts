import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { StadiumListComponent } from "./stadium-list";
import { StadiumEditComponent } from "./stadium-edit";
import { stadiumRoutes } from "./stadium.routes";
import { SharedModule } from "@app/shared";
import { StadiumCoreModule } from "../core";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { STADIUMS_ROUTE, STADIUMS_RU } from "@app/+constants";
import { MatInputModule } from '@angular/material';

@NgModule({
    imports: [
        RouterModule.forChild(stadiumRoutes),
        SharedModule,
        StadiumCoreModule,
        MatInputModule
    ],
    declarations: [
        StadiumEditComponent,
        StadiumListComponent
    ]
})
export class StadiumModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${STADIUMS_ROUTE}`, STADIUMS_RU);
        this.breadcrumbService.hideRouteRegex(`^/${STADIUMS_ROUTE}/[0-9]+$`);
    }
}