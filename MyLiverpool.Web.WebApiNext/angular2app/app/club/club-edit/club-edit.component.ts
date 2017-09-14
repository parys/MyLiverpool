﻿import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/takeUntil";
import { ClubService } from "../club.service";
import { Configuration } from "../../app.constants";
import { Club } from "../club.model";
import { Stadium, StadiumService } from "../../stadium/index";

@Component({
    selector: "club-edit",
    templateUrl: "./club-edit.component.html"
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
        private config: Configuration,
        private formBuilder: FormBuilder) {
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
                .subscribe((result: any) => {
                    this.imagePath = result.path + "?" + this.getRandomNumber();
                    this.editForm.controls["logo"].patchValue(result.path);
                },
                error => console.log(error));
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

        this.stadiums$ = this.editForm.controls["stadiumName"].valueChanges
            .debounceTime(this.config.debounceTime)
            .distinctUntilChanged()
            .switchMap((value: string) => this.stadiumService.getListByName(value));
    }
}