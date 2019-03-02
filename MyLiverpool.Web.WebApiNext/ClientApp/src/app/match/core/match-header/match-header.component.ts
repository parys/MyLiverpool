import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { MatchService } from "../match.service";
import { Match } from "@app/match/model";

@Component({
    selector: "match-header",
    templateUrl: "./match-header.component.html",
    styleUrls: ["./match-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default //todo temporary
})

export class MatchHeaderComponent implements OnInit {
    public item: Match;

    constructor(private matchService: MatchService,
        private cd: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
            this.matchService.getHeaderMatch()
                .subscribe(data => this.item = data,
                () => {
                    this.cd.markForCheck();
                });
        };
    
}