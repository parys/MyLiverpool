import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { MatSelect, MatSelectChange } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { Season } from "../../model";
import { SeasonService } from "../../core";
import { RolesCheckedService } from "@app/+auth";

@Component({
    selector: "season-calendar",
    templateUrl: "./season-calendar.component.html",
    styleUrls: ["./season-calendar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonCalendarComponent implements OnInit {
    public selected: Season;
    private id: number = 0;
    public seasons: Season[];

    @ViewChild("seasonSelect") seasonSelect: MatSelect;

    constructor(private service: SeasonService,
        public roles: RolesCheckedService,
        private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        if (+this.route.snapshot.params["id"]) {
            this.id = +this.route.snapshot.params["id"];
        }

        this.seasonSelect.selectionChange.subscribe((data: MatSelectChange) => {
            this.id = data.value;
            this.update(false);
        });

        this.service.getAllWithoutFilter()
            .subscribe(data => this.seasons = data,
                e => console.log(e));

        this.update(true);
    }

    private update(selectUpdate: boolean): void {
        this.service.getSingleWithMatches(this.id)
            .subscribe(data => {
                this.selected = data;
                if (selectUpdate) {
                    this.seasonSelect.value = data;
                }
            },
                e => console.log(e));
    }
}