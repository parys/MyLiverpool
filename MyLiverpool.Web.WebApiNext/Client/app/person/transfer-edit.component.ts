import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Subscription } from "rxjs/Subscription";
import { TransferService } from "./transfer.service";
import { PersonService } from "./person.service";
import { Transfer } from "./transfer.model";

@Component({
    selector: "transfer-edit",
    templateUrl: "./transfer-edit.component.html"
})

export class TransferEditComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub3: Subscription;
    private id: number;
    public editTransferForm: FormGroup;
    public clubs: string = "/api/v1/club/GetClubsByName?typed=:keyword";
    public persons: string = "/api/v1/person/GetPersonsByName?typed=:keyword";
    public seasons: string = "/api/v1/season/getSeasonsByYear?typed=:keyword";

    constructor(private transferService: TransferService,    
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private personService: PersonService,
        private sanitizer: DomSanitizer) {
    }

    public ngOnInit(): void {
        this.initForm();
        let id: number = this.route.snapshot.params["id"];

        if (id > 0) {
            this.sub3 = this.transferService.getSingle(id)
                .subscribe(data => this.parse(data),
                    error => console.log(error));
        };
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
        if(this.sub3) { this.sub3.unsubscribe(); }
    }

    public onSubmit(): void {
        const transfer: Transfer = this.parseForm();//todo bug should be fixed
        transfer.startDate = new Date(transfer.startDate);
        transfer.startDate = new Date(transfer.startDate.getFullYear(), transfer.startDate.getMonth(), transfer.startDate.getDate(), (-1) * transfer.startDate.getTimezoneOffset() / 60);
        if (transfer.finishDate != null) {
            transfer.finishDate = new Date(transfer.finishDate);
            transfer.finishDate = new Date(transfer.finishDate.getFullYear(),
                transfer.finishDate.getMonth(),
                transfer.finishDate.getDate(),
                (-1) * transfer.finishDate.getTimezoneOffset() / 60);
        }
        console.warn(transfer);
        if (this.id > 0) {
            this.transferService.update(this.id, transfer)
                .subscribe(data => this.router.navigate(["/transfers"]),
                    error => console.log(error));
        } else {
            this.transferService.create(transfer)
                .subscribe(data => this.router.navigate(["/transfers"]),
                    error => console.log(error));
        }
    }

    public updateClub(club: any): void {
        this.editTransferForm.get("clubId").patchValue("");
        if (club) {
            this.editTransferForm.get("clubId").patchValue(club.key);
            this.editTransferForm.get("clubName").patchValue(club.value);
        }
    }

    public updatePerson(person: any): void {
        if (person) {
            this.editTransferForm.get("personId").patchValue(person.key);
            this.editTransferForm.get("personName").patchValue(person.value);
        }
    }

    public updateSeason(season: any): void {
        if (season) {
            this.editTransferForm.get("seasonId").patchValue(season.key);
            this.editTransferForm.get("seasonName").patchValue(season.value);
        }
    }

    public autocompleteListFormatter = (data: any): SafeHtml => {
        const html: string = `<span>${data.value}</span>`;
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    private parse(data: Transfer): void {
        this.id = data.id;
        this.editTransferForm.patchValue(data);
    }

    private parseForm(): Transfer {
        if (!this.editTransferForm.get("clubName").value) {
            this.editTransferForm.get("clubId").patchValue("");
        }
        const item = this.editTransferForm.value;
        item.id = this.id;

        return item;
    }

    private initForm(): void {
        this.editTransferForm = this.formBuilder.group({
            'clubName': [""],
            'clubId': [""],
            'seasonId': ["", Validators.required],
            'seasonName': [""],
            'personId': ["", Validators.required],
            'personName': [""],
            'startDate': ["", Validators.required],
            'finishDate': [null],
            'amount': [null],
            'onLoan': [false, Validators.required],
            'coming': [true, Validators.required],
        });
    }

    private getIdFromUrl(url: string): string {
        if (url) {
            const pieces: string[] = url.split("/");
            return pieces[pieces.length - 1];
        }
        return null;
    }
}