import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@app/shared';
import { MatchPersonEditPanelComponent } from './matchPerson-edit-panel';
import { MatchPersonService } from './matchPerson.service';
import { MatchPersonPanelComponent } from './matchPerson-panel';
import { PersonEditModule } from '@app/person/shared';

@NgModule({
    imports: [
        SharedModule,
        PersonEditModule,
        MatAutocompleteModule,
        MatSelectModule
    ],
    declarations: [
        MatchPersonEditPanelComponent,
        MatchPersonPanelComponent
    ],
    exports: [
        MatchPersonEditPanelComponent,
        MatchPersonPanelComponent
    ],
    providers: [
        MatchPersonService
    ]
})
export class MatchPersonModule { }
