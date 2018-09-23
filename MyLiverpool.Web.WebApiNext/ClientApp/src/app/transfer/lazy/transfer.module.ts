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
import { MatNativeDateModule, MatDatepickerModule } from "@angular/material";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(transferRoutes),
        PersonCoreModule,
        ClubCoreModule,
        SeasonCoreModule,
        TransferCoreModule,
        MatNativeDateModule,
        MatDatepickerModule
    ],
    declarations: [
        TransferEditComponent,
        TransferListComponent,
        TransferCurrentListComponent
    ]
})
export class TransferModule { }