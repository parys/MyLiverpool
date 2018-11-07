import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TransferEditComponent } from "./transfer-edit";
import { TransferListComponent } from "./transfer-list";
import { transferRoutes } from "./transfer.routes";
import { SharedModule } from "@app/shared";
import { PersonCoreModule } from "@app/person";
import { TransferCoreModule } from "../core";
import { TransferCurrentListComponent } from "./transfer-current-list";
import { ClubCoreModule } from "@app/club";
import { SeasonCoreModule } from "@app/season";
import { MatNativeDateModule, MatDatepickerModule, MatTableModule } from "@angular/material";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { TRANSFERS_ROUTE, TRANSFERS_RU } from "@app/+constants";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(transferRoutes),
        PersonCoreModule,
        ClubCoreModule,
        SeasonCoreModule,
        TransferCoreModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatTableModule
    ],
    declarations: [
        TransferEditComponent,
        TransferListComponent,
        TransferCurrentListComponent
    ]
})
export class TransferModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${TRANSFERS_ROUTE}`, TRANSFERS_RU);
        this.breadcrumbService.addFriendlyNameForRoute(`/${TRANSFERS_ROUTE}/current`, "Текущие");
        this.breadcrumbService.hideRouteRegex(`^/${TRANSFERS_ROUTE}/[0-9]+$`);
    }
}