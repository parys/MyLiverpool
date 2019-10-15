import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { MatchService } from '@matches/match.service';
import { Match, MatchType, Stadium, StadiumFilters, PagedList } from '@domain/models';
import { StadiumService } from '@stadiums/core';
import { MATCHES_ROUTE } from '@constants/routes.constants';
import { DEBOUNCE_TIME } from '@constants/app.constants';

@Component({
    selector: 'match-edit',
    templateUrl: './match-edit.component.html'
})

export class MatchEditComponent implements OnInit {
    private id: number;
    public editMatchForm: FormGroup;
    public types: MatchType[];
    public stadiums$: Observable<Stadium[]>;
    public seasonName: string;

    constructor(private matchService: MatchService,
                private route: ActivatedRoute,
                private stadiumService: StadiumService,
                private router: Router,
                private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.initForm();
        const id = this.route.snapshot.params.id;
        if (+id > 0) {
            this.matchService.getSingle(id)
                .subscribe((data: Match) => this.parse(data));
        }

        this.matchService.getTypes()
            .subscribe((data: MatchType[]) => this.types = data);
    }

    public onSubmit(): void {
        const match = this.parseForm();
        this.matchService.createOrUpdate(this.id, match)
            .subscribe((data: Match) => this.router.navigate([MATCHES_ROUTE, data.id]));
    }

    public selectStadium(id: number) {
        this.editMatchForm.get('stadiumId').patchValue(id);
    }

    private parse(data: Match): void {
        this.id = data.id;
        this.editMatchForm.patchValue(data);
        this.editMatchForm.get('date').patchValue(new Date(data.dateTime));
        this.editMatchForm.get('time').patchValue(new Date(data.dateTime).toTimeString().slice(0, 8));
        this.seasonName = data.seasonName;
    }

    private parseForm(): Match {
        const item = this.editMatchForm.value;
        item.id = this.id;
        const date = this.editMatchForm.controls.date.value;
        const time = this.editMatchForm.controls.time.value;
        item.dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.slice(0, 2), time.slice(3, 5));
        return item;
    }

    private initForm(): void {
        this.editMatchForm = this.formBuilder.group({
            clubName: [''],
            clubId: ['', Validators.required],
            seasonId: ['', Validators.required],
            isHome: [true, Validators.required],
            date: [null, Validators.required],
            time: [null, Validators.required],
            typeId: ['', Validators.required],
            stadiumId: ['', Validators.required],
            stadiumName: ['', Validators.required],
            photoUrl: [null],
            videoUrl: [null],
            previewId: [null],
            reportId: [null]
        });

        this.stadiums$ = this.editMatchForm.controls.stadiumName.valueChanges.pipe(
            debounceTime(DEBOUNCE_TIME),
            distinctUntilChanged(),
            switchMap((value: string) => {
                const filter = new StadiumFilters();
                filter.name = value;
                return this.stadiumService.getAll(filter);
            }),
            switchMap((pagingStadiums: PagedList<Stadium>): Observable<Stadium[]> => {
                return of(pagingStadiums.results);
            }));
    }
}
