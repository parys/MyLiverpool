import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { TransferState, makeStateKey } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { MatchService } from "../match.service";
import { Match } from "@app/match/model";
import { RolesCheckedService } from "@app/+auth";

const MATCH_CALENDAR_KEY = makeStateKey<Match[]>("match-calendar");

@Component({
    selector: "match-calendar",
    templateUrl: "./match-calendar.component.html",
    styleUrls: ["./match-calendar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: true
})
export class MatchCalendarComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public last: Match;
    public next: Match;

    constructor(private service: MatchService,
        public roles: RolesCheckedService,
        private transferState: TransferState,
        private cd: ChangeDetectorRef) { }

    public ngOnInit(): void {
        const savedData = this.transferState.get(MATCH_CALENDAR_KEY, null);
        if (savedData) {
            this.parse(savedData);
        } else {
            this.sub = this.service.getForCalendar().subscribe(data => {
                this.parse(data);
                this.transferState.set(MATCH_CALENDAR_KEY, data);
            },
                e => console.log(e));
        }
    }
    private parse(matches: Match[]): void {
        if (matches.length === 1) {
            if (matches[0].scoreHome) {
                this.last = matches[0];
            } else {
                this.next = matches[0];
            }
        } else {
            [this.last, this.next] = matches;
        }
        this.cd.markForCheck();
    }

    public ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
    }
}