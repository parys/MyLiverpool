import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';

import { Season, PagedList } from '@domain/models';

import { SeasonService } from '@seasons/season.service';
import { Select } from '@ngxs/store';
import { AuthState } from '@auth/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'season-calendar',
    templateUrl: './season-calendar.component.html',
    styleUrls: ['./season-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonCalendarComponent implements OnInit, AfterViewInit {
    public selected: Season;
    private id = 0;
    public seasons: Season[];

    @ViewChild('seasonSelect') seasonSelect: MatSelect;

    @Select(AuthState.isAdminAssistant) isAdminAssistant$: Observable<boolean>;

    constructor(private service: SeasonService,
                private cd: ChangeDetectorRef,
                private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.id = +this.route.snapshot.params.id || 0;


        this.service.getAllWithoutFilter()
            .subscribe((data: PagedList<Season>) => this.seasons = data.results);

        this.update(true);
    }

    public ngAfterViewInit(): void {
        this.seasonSelect.selectionChange.subscribe((data: MatSelectChange) => {
            this.id = data.value;
            this.update(false);
        });

    }

    private update(selectUpdate: boolean): void {
        this.service.getSingleCalendarWithMatches(this.id)
            .subscribe((data: Season) => {
                this.selected = data;
                if (selectUpdate) {
                    this.seasonSelect.value = data.id;
                }
            },
                null,
                () => {
                    this.cd.markForCheck();
                });
    }
}
