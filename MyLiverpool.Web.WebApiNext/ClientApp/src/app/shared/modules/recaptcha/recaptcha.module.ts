import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecaptchaComponent } from './recaptcha.component';
import { ReCaptchaModule } from 'angular2-recaptcha';

@NgModule({
    imports: [
        CommonModule,
        ReCaptchaModule
    ],
    declarations: [
        RecaptchaComponent
    ],
    exports: [
        RecaptchaComponent
    ]
})
export class RecaptchaModule { }
