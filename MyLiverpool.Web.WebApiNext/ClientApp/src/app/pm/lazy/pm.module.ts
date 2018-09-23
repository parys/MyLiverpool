import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { pmRoutes } from "./pm.routes";
import { PmListComponent } from "./pm-list";
import { PmDetailComponent } from "./pm-detail";
import { PmEditComponent } from "./pm-edit";
import { PmCoreModule } from "../core";
import { EditorModule } from "@app/editor";
import { MatTabsModule } from "@angular/material";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(pmRoutes),
        EditorModule,
        PmCoreModule,
        MatTabsModule
    ],
    declarations: [
        PmEditComponent,
        PmDetailComponent,
        PmListComponent
    ]
})
export class PmModule { }