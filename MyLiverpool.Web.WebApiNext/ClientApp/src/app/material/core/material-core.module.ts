import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared';
import { MaterialListComponent } from './material-list';
import { MaterialActivateDialogComponent } from './material-activate-dialog';
import { MaterialService } from './material.service';
import { MatchCoreModule } from '@app/match';

@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        MatchCoreModule,
    ],
    declarations: [
        MaterialListComponent,
        MaterialActivateDialogComponent
    ],
    entryComponents: [
        MaterialActivateDialogComponent
    ],
    providers: [
        MaterialService
    ]
})
export class MaterialCoreModule { }
