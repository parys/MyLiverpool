import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Input } from '@angular/core';
import { FormControl, ControlValueAccessor } from '@angular/forms';

import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AbstractControlComponent, ControlValueProvider } from '@domain/base';
import { PagedList, Season, SeasonFilters } from '@domain/models';
import { DEBOUNCE_TIME } from '@constants/app.constants';

import { SeasonService } from '@seasons/season.service';


@Component({
    selector: 'select-season-form-field',
    templateUrl: './select-season-form-field.component.html',
    styleUrls: ['./select-season-form-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ControlValueProvider(SelectSeasonFormFieldComponent)
    ],
})
export class SelectSeasonFormFieldComponent extends AbstractControlComponent<number>
    implements OnInit, ControlValueAccessor {

    @Input() seasonName: string;
    @ViewChild('selectSeason', { static: true }) selectSeason: ElementRef;

    public seasons$: Observable<Season[]>;
    public seasonCtrl = new FormControl();

    constructor(private seasonService: SeasonService, protected cdRef: ChangeDetectorRef) {
        super(cdRef);
    }

    ngOnInit(): void {
        this.seasons$ = this.seasonCtrl.valueChanges.pipe(
            debounceTime(DEBOUNCE_TIME),
            distinctUntilChanged(),
            switchMap((value: string) => {
                const filter = new SeasonFilters();
                filter.name = value;
                return this.seasonService.getAll(filter);
            }),
            switchMap((pagingClubs: PagedList<Season>): Observable<Season[]> => {
                return of(pagingClubs.results);
            }));
    }

    public onSelectionChange(seasonId: number): void {
        this.value = seasonId;
    }
}
