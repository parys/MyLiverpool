import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AccountService } from "../account.service";

@Component({
    selector: "unconfirmedEmail",
    templateUrl: "./unconfirmedEmail.component.html"
})

export class UnconfirmedEmailComponent implements OnInit {
    public unconfirmedForm: FormGroup; 
    public finish: boolean;
    public isHuman: boolean = false;

    constructor(private service: AccountService,
        private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.unconfirmedForm = this.formBuilder.group({
            email: ["", Validators.compose([
                Validators.required,
                Validators.minLength(6),
                Validators.email])]
        });
    }

    public onSubmit(): void {
        const email = this.unconfirmedForm.controls["email"].value;
        this.service.resendConfirmEmail(email).subscribe((data: boolean) => {
                if (data) {
                    this.finish = true;
                }
            });
        this.isHuman = false;
    }
}