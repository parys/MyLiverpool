import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { MatchEventEditPanelComponent } from './matchEvent-edit-panel';
import { MatchEventMatchPanelComponent } from './matchEvent-match-panel';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatchEventCoreModule } from '../core';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatInputModule,
        MatSlideToggleModule,
        MatchEventCoreModule
    ],
    declarations: [
        MatchEventEditPanelComponent,
        MatchEventMatchPanelComponent
    ],
    exports: [
        MatchEventEditPanelComponent,
        MatchEventMatchPanelComponent
    ]
})
export class MatchEventModule { }
