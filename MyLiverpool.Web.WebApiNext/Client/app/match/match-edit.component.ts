import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Observable } from "rxjs/Observable";
import { MatchService } from "./index";
import { SeasonService } from "../season/index";
import { Match } from "./match.model";                        
import { MatchType } from "./matchType.model";  
import { Season } from "../season/season.model";
import { Stadium } from "../stadium/index";
import { StadiumService } from "../stadium/stadium.service";

@Component({
    selector: "match-edit",
    templateUrl: "./match-edit.component.html"
})

export class MatchEditComponent implements OnInit {
    private id: number;
    public editMatchForm: FormGroup;
    public clubs: string = "/api/v1/club/GetClubsByName?typed=:keyword";
    public types: MatchType[];
    public seasons: Season[];
    public stadiums: Stadium[];
    public filteredStadiums$: Observable<Stadium[]>;

    constructor(private matchService: MatchService,    
        private route: ActivatedRoute,
        private stadiumService: StadiumService,
        private router: Router,
        private formBuilder: FormBuilder,
        private seasonService: SeasonService,
        private sanitizer: DomSanitizer) {
    }

    public ngOnInit(): void {
        this.initForm();
        let id = this.route.snapshot.params["id"];
        if(id && id > 0) {
                this.matchService.getSingle(id)
                    .subscribe(data => this.parse(data),
                    error => console.log(error));
            };
        
        this.matchService.getTypes()
            .subscribe(data => this.types = data,
                error => console.log(error));

        this.seasonService.getAll()
            .subscribe(data => this.seasons = data,
            error => console.log(error));

        this.stadiumService.getAllAll().subscribe(data => this.stadiums = data,
            e => console.log(e), () => {
                this.filteredStadiums$ = this.editMatchForm.controls["stadiumName"].valueChanges
                    .startWith(null)
                    .map((name: string) => this.filterStadiums(name));
            });
    }


    public filterStadiums(val: string) {
        return val ? this.stadiums.filter(s => new RegExp(`^${val}`, 'gi').test(s.name))
            : this.stadiums;
    }

    public onSubmit(): void {
        let match = this.parseForm();
        if (this.id > 0) {
            this.matchService.update(this.id, match)
                .subscribe(data => this.router.navigate(["/matches"]),
                error => console.log(error));
        } else {
            this.matchService.create(match)
                .subscribe(data => this.router.navigate(["/matches"]),
                error => console.log(error));
        }
    }

    public updateClub(club: any): void {
        if (club) {
            this.editMatchForm.get("clubId").patchValue(club.key);
            this.editMatchForm.get("clubName").patchValue(club.value);
        }
    }

    public selected(id: number) {
        this.editMatchForm.get("stadiumId").patchValue(id);
    }

    public autocompleteListFormatter = (data: any): SafeHtml => {
        let html = `<span>${data.value}</span>`;
        return this.sanitizer.bypassSecurityTrustHtml(html);
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
        let date = this.editMatchForm.controls["date"].value;
        let time = this.editMatchForm.controls["time"].value;
        item.dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.slice(0, 2), time.slice(3, 5));
        return item;
    }

    private initForm(): void {
        this.editMatchForm = this.formBuilder.group({
            'clubName': [""],
            'clubId': ["", Validators.required],
            'seasonId': ["", Validators.required],
            'isHome': ["true", Validators.required],
            'date': ["", Validators.required],
            'time': ["", Validators.required],
            'typeId': ["", Validators.required],
            'stadiumId': ["", Validators.required],
            'stadiumName': ["", Validators.required],
            'reportUrl': [""],
            'photoUrl': [""],
            'videoUrl': [""],
            'scoreHome': [null],
            'scoreAway': [null]
        });
    }

    private getIdFromUrl(url: string): string {
        if (url) {
            let pieces = url.split("/");
            return pieces[pieces.length - 1];
        }
        return null;
    }
}