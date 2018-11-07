import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@app/shared";
import { MatchEventEditPanelComponent } from "./matchEvent-edit-panel";
import { MatchEventService } from "./matchEvent.service";
import { MatchEventMatchPanelComponent } from "./matchEvent-match-panel";
import { MatSelectModule } from "@angular/material";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MatSelectModule
    ],
    declarations: [
        MatchEventEditPanelComponent,
        MatchEventMatchPanelComponent
    ],
    exports: [
        MatchEventEditPanelComponent,
        MatchEventMatchPanelComponent,
        MatSelectModule
    ],
    providers: [
        MatchEventService
    ]
})
export class MatchEventModule { }