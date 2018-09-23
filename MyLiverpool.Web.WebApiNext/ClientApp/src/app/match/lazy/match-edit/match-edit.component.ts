import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, of } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { MatchService } from "@app/match/core";
import { SeasonService, Season } from "@app/season";
import { Match, MatchType } from "@app/match/model";
import { Stadium, StadiumService, StadiumFilters } from "@app/stadium";
import { Club, ClubService, ClubFilters } from "@app/club";
import { DEBOUNCE_TIME, MATCHES_ROUTE } from "@app/+constants";
import { Pageable } from "@app/shared";

@Component({
    selector: "match-edit",
    templateUrl: "./match-edit.component.html"
})

export class MatchEditComponent implements OnInit {
    private id: number;
    public editMatchForm: FormGroup;
    public types: MatchType[];
    public seasons: Season[];
    public clubs$: Observable<Club[]>;
    public stadiums$: Observable<Stadium[]>;

    constructor(private matchService: MatchService,    
        private route: ActivatedRoute,
        private stadiumService: StadiumService,
        private router: Router,
        private formBuilder: FormBuilder,
        private seasonService: SeasonService,
        private clubService: ClubService) {
    }

    public ngOnInit(): void {
        this.initForm();
        let id = this.route.snapshot.params["id"];
        if(+id > 0) {
                this.matchService.getSingle(id)
                    .subscribe(data => this.parse(data),
                    e => console.log(e));
            };
        
        this.matchService.getTypes()
            .subscribe(data => this.types = data,
                e => console.log(e));

        this.seasonService.getAllWithoutFilter()
            .subscribe(data => this.seasons = data,
            e => console.log(e));
    }

    public onSubmit(): void {
        const match = this.parseForm();
        this.matchService.createOrUpdate(this.id, match)
            .subscribe(data => this.router.navigate([MATCHES_ROUTE, data.id]),
                e => console.log(e));
    }

    public selectStadium(id: number) {
        this.editMatchForm.get("stadiumId").patchValue(id);
    }

    public selectClub(id: number) {
        this.editMatchForm.get("clubId").patchValue(id);
    }

    private parse(data: Match): void {
        this.id = data.id;
        this.editMatchForm.patchValue(data);
        this.editMatchForm.get("date").patchValue(new Date(data.dateTime));
        this.editMatchForm.get("time").patchValue(new Date(data.dateTime).toTimeString().slice(0, 8));
    }

    private parseForm(): Match {
        const item = this.editMatchForm.value;
        item.id = this.id;
        const date = this.editMatchForm.controls["date"].value;
        const time = this.editMatchForm.controls["time"].value;
        item.dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.slice(0, 2), time.slice(3, 5));
        return item;
    }

    private initForm(): void {
        this.editMatchForm = this.formBuilder.group({
            clubName: [""],
            clubId: ["", Validators.required],
            seasonId: ["", Validators.required],
            isHome: [true, Validators.required],
            date: [null, Validators.required],
            time: [null, Validators.required],
            typeId: ["", Validators.required],
            stadiumId: ["", Validators.required],
            stadiumName: ["", Validators.required],
            photoUrl: [null],
            videoUrl: [null],
            previewId: [null],
            reportId: [null]
        });

        this.stadiums$ = this.editMatchForm.controls["stadiumName"].valueChanges.pipe(
            debounceTime(DEBOUNCE_TIME),
            distinctUntilChanged(),
            switchMap((value: string) => {
                const filter = new StadiumFilters();
                filter.name = value;
                return this.stadiumService.getAll(filter);
            }),
            switchMap((pagingStadiums: Pageable<Stadium>): Observable<Stadium[]> => {
                return of(pagingStadiums.list);
            }));

        this.clubs$ = this.editMatchForm.controls["clubName"].valueChanges.pipe(
            debounceTime(DEBOUNCE_TIME),
            distinctUntilChanged(),
            switchMap((value: string): Observable<Pageable<Club>> => {
                const filter = new ClubFilters();
                filter.name = value;
                return this.clubService.getAll(filter);
            }),
            switchMap((pagingClubs: Pageable<Club>): Observable<Club[]> => {
                return of(pagingClubs.list);
            })
        );
    }
}