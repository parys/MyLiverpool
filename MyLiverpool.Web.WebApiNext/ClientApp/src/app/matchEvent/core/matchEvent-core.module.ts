import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@app/shared";
import { MatchEventService } from "./matchEvent.service";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
    ],
    providers: [
        MatchEventService
    ]
})
export class MatchEventCoreModule { }