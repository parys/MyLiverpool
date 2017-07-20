import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AccountService } from "./account.service";
import { GlobalValidators } from "../shared/index";

@Component({
    selector: "forgot-password",
    templateUrl: "./forgotPassword.component.html"
})

export class ForgotPasswordComponent implements OnInit {
    forgotForm: FormGroup;
    email: string;
    finish: boolean;
    isHuman: boolean = false;

    constructor(private service: AccountService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.forgotForm = this.formBuilder.group({
            'email': ["", Validators.compose([
                Validators.required,
                Validators.minLength(6),
                GlobalValidators.mailFormat])]
        });
    }

    public onSubmit(): void {     
        this.email = this.forgotForm.controls["email"].value;        
        this.service.forgotPassword(this.email).subscribe(data => data,
            error => console.log(error),
            () => { }
        );
        this.finish = true;
        this.isHuman = false;
    }
}