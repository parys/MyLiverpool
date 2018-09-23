import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, Subscription, of } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ClubService } from "@app/club/core";
import { Club } from "@app/club/model";
import { Stadium, StadiumService, StadiumFilters } from "@app/stadium";
import { CLUBS_ROUTE, DEBOUNCE_TIME } from "@app/+constants";
import { Pageable } from "@app/shared";

@Component({
    selector: "club-edit",
    templateUrl: "./club-edit.component.html",
    styleUrls: ["./club-edit.component.scss"]
})

export class ClubEditComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    private id: number;
    public editForm: FormGroup;
    public imagePath: string;
    public stadiums$: Observable<Stadium[]>;

    constructor(private clubService: ClubService,
        private stadiumService: StadiumService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.initForm();
        this.sub = this.route.params.subscribe(params => {
            this.id = +params["id"];
            if (this.id > 0) {
                this.sub2 = this.clubService.getSingle(this.id)
                    .subscribe(data => this.parse(data),
                    e => console.log(e));
            }
        });
    }

    public ngOnDestroy(): void {
        if(this.sub) {this.sub.unsubscribe();}
        if(this.sub2) {this.sub2.unsubscribe();}
    }

    public onSubmit(): void {
        const club: Club = this.parseForm();
            this.clubService.createOrUpdate(this.id, club)
                .subscribe(data => this.router.navigate([CLUBS_ROUTE]),
                e => console.log(e));
    }

    public onUploadImage(event: any): void {
        if (event.currentTarget.files.length > 0) {
            this.clubService.uploadLogo(event.currentTarget.files[0], this.editForm.controls["englishName"].value)
                .subscribe((result: any) => {
                    this.imagePath = result.path + "?" + this.getRandomNumber();
                    this.editForm.controls["logo"].patchValue(result.path);
                },
                e => console.log(e));
        }
    }

    public selectStadium(id: number) {
        this.editForm.get("stadiumId").patchValue(id);
    }

    private getRandomNumber(): number {
        return Math.random();
    }

    private parse(data: Club): void {
        this.id = data.id;
        this.editForm.patchValue(data);
        this.imagePath = data.logo;
    }

    private parseForm(): Club {
        const item = this.editForm.value;
        item.id = this.id;
        return item;
    }

    private initForm(): void {
        this.editForm = this.formBuilder.group({
            englishName: ["", Validators.compose([
                Validators.required, Validators.maxLength(30)])],
            logo: ["", Validators.required],
            name: ["", Validators.compose([
                Validators.required, Validators.maxLength(30)])],
            stadiumId: ["", Validators.required],
            stadiumName: ["", Validators.required],
            id: [0, Validators.required]
        });

        this.stadiums$ = this.editForm.controls["stadiumName"].valueChanges.pipe(
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
    }
}