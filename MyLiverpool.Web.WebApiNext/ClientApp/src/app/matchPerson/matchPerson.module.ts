import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared";
import { MatchPersonEditPanelComponent } from "./matchPerson-edit-panel";
import { MatchPersonService } from "./matchPerson.service";
import { MatchPersonPanelComponent } from "./matchPerson-panel";
import { PersonEditModule } from "@app/person";

@NgModule({
    imports: [
        SharedModule,
        PersonEditModule
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