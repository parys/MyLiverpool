import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SharedModule } from '@app/shared';
import { ImageCoreModule } from '@app/image';
import { MaterialCategoryCoreModule } from '@app/materialCategory';
import { MaterialCoreModule } from '../../core/material-core.module';
import { MaterialEditComponent } from './material-edit.component';
import { materialEditRoutes } from './material-edit.routes';
import { EditorModule } from '@app/editor';
import { MaterialGuardDialogComponent } from './material-guard-dialog';
import { MaterialLeaveGuard } from './leave-guard/leave-guard.service';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(materialEditRoutes),
        EditorModule,
        MaterialCoreModule,
        MaterialCategoryCoreModule,
        ImageCoreModule,
        MatSelectModule,
        MatCheckboxModule,
        MatInputModule
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
