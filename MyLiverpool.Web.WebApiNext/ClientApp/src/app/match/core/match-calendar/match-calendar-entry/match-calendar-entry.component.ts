import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Match } from "@app/match/model";
import { RolesCheckedService } from "@app/+auth";

@Component({
    selector: "match-calendar-entry",
    templateUrl: "./match-calendar-entry.component.html",
    styleUrls: ["./match-calendar-entry.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchCalendarEntryComponent {
    @Input() public match: Match;
    @Input() public title: string;

    constructor(
        public roles: RolesCheckedService) { }
}