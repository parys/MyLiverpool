import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { InjuryEditComponent } from "./injury-edit";
import { InjuryListComponent } from "./injury-list";
import { injuryRoutes } from "./injury.routes";
import { SharedModule } from "@app/shared";
import { InjuryCoreModule } from "../core";
import { MatNativeDateModule, MatDatepickerModule } from "@angular/material";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(injuryRoutes),
        InjuryCoreModule,
        MatNativeDateModule,
        MatDatepickerModule
    ],
    declarations: [
        InjuryEditComponent,
        InjuryListComponent
    ]
})
export class InjuryModule { }