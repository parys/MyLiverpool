import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Subscription } from "rxjs/Subscription";   
import { Pm } from "./pm.model";
import { PmService } from "./pm.service";

@Component({
    selector: "pm-edit",
    templateUrl: "./pm-edit.component.html"
})
export class PmEditComponent implements OnInit, OnDestroy {
    public editPmForm: FormGroup;
    public id: number = 0;
    private sub: Subscription;
    public users = "/api/v1/user/GetUserNames?typed=:keyword";

    constructor(private service: PmService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer) {
    }

    public ngOnInit(): void {
        this.editPmForm = this.formBuilder.group({
            'receiverId': [
                "", Validators.compose([
                    Validators.required
                ])
            ],
            'receiver': [
                "", Validators.compose([
                    Validators.required
                ])
            ],
            'title': [
                "", Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ],
            'message': [
                "", Validators.compose([
                    Validators.required,
                    Validators.maxLength(2500)
                ])
            ]
        });
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
    }

    public updateUsername(user: any): void {
        console.log(user);
        if (user) {
            this.editPmForm.patchValue({ receiverId: user.id });
            this.editPmForm.patchValue({ receiver: user.username });
        } else {
            this.editPmForm.patchValue({ receiverId: "" });
            this.editPmForm.patchValue({ receiver: ""});
        }
    }

    public autocompleteListFormatter = (data: any): SafeHtml => {
        let html = `<span>${data.username}</span>`;
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }


    public onSubmit(): void {
        const model: Pm = this.editPmForm.value;

        this.sub = this.service.create(model).subscribe(data => {
                this.editPmForm.patchValue({message: ""});
            },
            e => console.log(e),
            () => {
                //todo add snackbar
            });
    }
}