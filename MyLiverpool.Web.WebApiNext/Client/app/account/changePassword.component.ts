import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AccountService } from "./account.service";    
import { GlobalValidators } from "../shared/index";
import { ChangePassword } from "./changePassword.model";

@Component({
    selector: "change-password",
    templateUrl: "./changePassword.component.html"
})

export class ChangePasswordComponent implements OnInit {

    passwordForm: FormGroup;
    isHuman: boolean = false;

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

    onSubmit(): void {
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
        this.isHuman = false;
    }
}