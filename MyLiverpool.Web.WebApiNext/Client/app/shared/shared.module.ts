import { NgModule } from "@angular/core";
import { RecaptchaComponent } from "./recaptcha.component";
import { HttpWrapper } from "./httpWrapper";
import { LocalStorageService } from "./localStorage.service";
import { LocalStorage } from "./local-storage";
import { RolesCheckedService } from "./roles-checked.service";
import { GlobalValidators } from "./globalValidators";
import { ReCaptchaModule } from "angular2-recaptcha";
import { DeleteDialogComponent } from "./delete-dialog.component";
import { MdButtonModule } from "@angular/material";

@NgModule({
    imports: [
        ReCaptchaModule, 
MdButtonModule
    ],
    declarations: [
        DeleteDialogComponent,
        RecaptchaComponent
    ],
    exports: [
        DeleteDialogComponent,
        RecaptchaComponent
    ],
    providers: [
        GlobalValidators,
        HttpWrapper,
        LocalStorageService,
        RolesCheckedService,
        //{ provide: LocalStorage, useFactory: () => (window) ? window.localStorage : {} }
        //LocalStorage
    ],
    entryComponents: [
        DeleteDialogComponent
    ]
})
export class SharedModule { }

/*                                 
import * from "./local-storage";             */