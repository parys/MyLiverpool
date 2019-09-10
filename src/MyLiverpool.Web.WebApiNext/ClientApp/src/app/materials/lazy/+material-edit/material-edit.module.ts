import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/index';
import { ImageCoreModule } from '@images/core';
import { MaterialCategoryCoreModule } from '@material-categories/core';
import { MaterialCoreModule } from '@materials/core/material-core.module';
import { MaterialEditComponent } from '@materials/lazy/+material-edit/material-edit.component';
import { materialEditRoutes } from '@materials/lazy/+material-edit/material-edit.routes';
import { MaterialGuardDialogComponent } from '@materials/lazy/+material-edit/material-guard-dialog';
import { MaterialLeaveGuard } from './leave-guard/leave-guard.service';
import { MaterialEditMaterialModule } from './material-edit-material.module';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(materialEditRoutes),
        MaterialCoreModule,
        MaterialCategoryCoreModule,
        ImageCoreModule,
        MaterialEditMaterialModule
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
