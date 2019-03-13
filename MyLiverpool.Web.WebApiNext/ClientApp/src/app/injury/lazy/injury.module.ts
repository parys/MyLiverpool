import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { InjuryEditComponent } from "./injury-edit";
import { InjuryListComponent } from "./injury-list";
import { injuryRoutes } from "./injury.routes";
import { SharedModule } from "@app/shared";
import { InjuryCoreModule } from "../core";
import {
    MatNativeDateModule, MatDatepickerModule, MatTableModule,
    MatAutocompleteModule, MatSortModule, MatInputModule
} from "@angular/material";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { INJURIES_ROUTE, INJURIES_RU } from "@app/+constants";
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(injuryRoutes),
        InjuryCoreModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatTableModule,
        MatAutocompleteModule,
        MatSortModule,
        MatInputModule
    ],
    declarations: [
        InjuryEditComponent,
        InjuryListComponent
    ]
})
export class InjuryModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${INJURIES_ROUTE}`, INJURIES_RU);
        this.breadcrumbService.hideRouteRegex(`^/${INJURIES_ROUTE}/[0-9]+$`);
    }
}