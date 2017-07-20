import { Component, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "recaptcha",
    template: ` <re-captcha language="ru"
                            size="small"
                            (captchaExpired)="handleCorrectCaptcha($event)"
                            (captchaResponse)="handleCorrectCaptcha($event)"
                            site_key="6Ld0AxEUAAAAAA9BH17mRd8MDPqLGDzSomOEeeIY">
                </re-captcha>`
})
export class RecaptchaComponent {
    @Output() isHuman = new EventEmitter<boolean>();

    handleCorrectCaptcha(event: string): void {
        if (event) {
            this.isHuman.emit(true);
        } else {
            this.isHuman.emit(false);
        }
    }
}