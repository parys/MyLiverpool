import { NgModule } from "@angular/core";
import { MatAutocompleteModule, MatSelectModule } from "@angular/material";
import { SharedModule } from "@app/shared";
import { MatchPersonEditPanelComponent } from "./matchPerson-edit-panel";
import { MatchPersonService } from "./matchPerson.service";
import { MatchPersonPanelComponent } from "./matchPerson-panel";
import { PersonEditModule } from "@app/person/shared";

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