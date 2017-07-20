import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { ClubService } from "./club.service";
import { Configuration } from "../app.constants";
import { Club } from "./club.model";
import { Stadium } from "../stadium/index";
import { StadiumService } from "../stadium/stadium.service";
import { LocalStorageService } from "../shared/index";

@Component({
    selector: "club-edit",
    templateUrl: "./club-edit.component.html"
})

export class ClubEditComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    private id: number;
    private static changer: Subject<any> = new Subject<any>();
    public editForm: FormGroup;
    public imagePath: string;
    public stadiums: Stadium[];
    public filteredStadiums$: Observable<Stadium[]>;

    constructor(private clubService: ClubService,
        private stadiumService: StadiumService,
        private route: ActivatedRoute,
        private router: Router,
        private config: Configuration,
        private localStorage: LocalStorageService,
        private formBuilder: FormBuilder) {
    }

    public filterStadiums(val: string) {
        return val ? this.stadiums.filter(s => new RegExp(`^${val}`, 'gi').test(s.name))
            : this.stadiums;
    }

    public ngOnInit(): void {
        this.initForm();
        this.sub = this.route.params.subscribe(params => {
            this.id = +params["id"];
            if (this.id > 0) {
                this.sub2 = this.clubService.getSingle(this.id)
                    .subscribe(data => this.parse(data),
                    error => console.log(error));
            }
        });
        this.stadiumService.getAllAll().subscribe(data => this.stadiums = data,
            e => console.log(e), () => {
                this.filteredStadiums$ = this.editForm.controls["stadiumName"].valueChanges
                    .startWith(null)
                    .map((name: string) => this.filterStadiums(name));
            });
    }

    public ngOnDestroy(): void {
        if(this.sub) {this.sub.unsubscribe();}
        if(this.sub2) {this.sub2.unsubscribe();}
    }

    public onSubmit(): void {
        const club: Club = this.parseForm();
        if (this.id > 0) {
            this.clubService.update(this.id, club)
                .subscribe(data => this.router.navigate(["/clubs"]),
                error => console.log(error));
        } else {
            this.clubService.create(club)
                .subscribe(data => this.router.navigate(["/clubs"]),
                error => console.log(error));
        }
    }

    public onUploadImage(event: any): void {
        if (event.currentTarget.files.length > 0) {
            this.clubService.uploadLogo(event.currentTarget.files[0], this.editForm.controls["englishName"].value)
                .subscribe(result => {
                    this.imagePath = result + "?" + this.getRandomNumber();
                    this.editForm.controls["logo"].patchValue(result);
                },
                error => console.log(error));
        }
    }

    public selected(id: number) {
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
        let item = this.editForm.value;
        item.id = this.id;
        return item;
    }

    private initForm(): void {
        this.editForm = this.formBuilder.group({
            'englishName': ["", Validators.compose([
                Validators.required, Validators.maxLength(30)])],
            'logo': ["", Validators.required],
            'name': ["", Validators.compose([
                Validators.required, Validators.maxLength(30)])],
            'stadiumId': ["", Validators.required],
            'stadiumName': ["", Validators.required],
            'id': [0, Validators.required]
        });
        //this.editForm.controls["stadiumName"].valueChanges
        //    .debounceTime(this.config.debounceTime)
        //    .takeUntil(ClubEditComponent.changer)
        //    .take(1)
        //    .switchMap((value: string) => this.stadiumService.getListByName(value))
        //    .subscribe((data: Stadium[]) => this.stadiums = data,
        //        e => console.log(e));
    }
}