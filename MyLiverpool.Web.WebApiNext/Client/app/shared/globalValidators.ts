import { FormControl, FormGroup } from "@angular/forms";
import { Injectable } from "@angular/core";

@Injectable()
export class GlobalValidators {

    static mailFormat(control: FormControl): IValidationResult {
        const EMAIL_REGEXP: RegExp  = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (control.value.length < 6) {      // todo move to config
            return null;
        }
        if (!EMAIL_REGEXP.test(control.value)) {
            return { "incorrectMailFormat": true };
        }
        return null;
    }

    static matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
        return (group: FormGroup): IValidationResult => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];

            if (password.value !== confirmPassword.value) {
                return {
                    "mismatchedPasswords" : true
                };
            }
            return null;
        };
    }

    static mustBeGreaterThanZero(control: FormControl): IValidationResult {
        if (control.value !== "" && +control.value > 0) {
            return null;
        }
        return { "ValueMustBeGreaterThanZero": true };
    }
}

interface IValidationResult {
    [key: string]: boolean;
}