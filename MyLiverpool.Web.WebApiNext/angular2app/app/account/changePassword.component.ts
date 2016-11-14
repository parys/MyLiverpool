﻿import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";        
import { AccountService } from "./account.service";    
import { GlobalValidators } from "../shared/index";
import { ChangePassword } from "./changePassword.model";

@Component({
    selector: "change-password",
    template: require("./changePassword.component.html")
})

export class ChangePasswordComponent implements OnInit {

    passwordForm: FormGroup;

    constructor(private service: AccountService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.passwordForm = this.formBuilder.group({
            'oldPassword': ["", Validators.compose([
                Validators.required, Validators.minLength(6)])],
            'newPassword': ["", Validators.compose([
                Validators.required, Validators.minLength(6)])],
            'confirmPassword': ["", Validators.compose([
                Validators.required, Validators.minLength(6)])]
        }, { validator: GlobalValidators.matchingPasswords("newPassword", "confirmPassword") });
    }

    onSubmit(ra: any): void {
        let model = new ChangePassword();
        model.oldPassword = this.passwordForm.controls["oldPassword"].value;
        model.newPassword = this.passwordForm.controls["newPassword"].value;
        model.confirmPassword = this.passwordForm.controls["confirmPassword"].value;
        this.service.changePassword(model).subscribe(data => {
                if (data) {
                    //what todo?
                    console.log("password changed");
                }
            },
            error => console.log(error),
            () => { }
        );
    }
}