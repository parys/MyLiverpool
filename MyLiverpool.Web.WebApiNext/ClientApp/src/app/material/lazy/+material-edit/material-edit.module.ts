import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { ImageCoreModule } from "@app/image";
import { MaterialCategoryCoreModule } from "@app/materialCategory";
import { MaterialCoreModule } from "../../core/material-core.module";
import { MaterialEditComponent } from "./material-edit.component";
import { materialEditRoutes } from "./material-edit.routes";
import { EditorModule } from "@app/editor";
import { MaterialGuardDialogComponent } from "./material-guard-dialog";
import { MaterialLeaveGuard } from "./leave-guard/leave-guard.service";
import { MatSelectModule } from "@angular/material";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(materialEditRoutes),
        EditorModule,
        MaterialCoreModule,
        MaterialCategoryCoreModule,
        ImageCoreModule,
        MatSelectModule
    ],
    declarations: [
        MaterialEditComponent,
        MaterialGuardDialogComponent
    ],
    entryComponents: [
        MaterialGuardDialogComponent
    ],
    providers: [
        MaterialLeaveGuard
    ]
})
export class MaterialEditModule { }