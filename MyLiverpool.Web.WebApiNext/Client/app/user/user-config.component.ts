import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MdSnackBar } from "@angular/material";
import { Subscription } from "rxjs/Subscription";
import { UserConfig } from "./user-config.model";                          
import { UserService } from "./user.service";

@Component({
    selector: "user-config",
    templateUrl: "./user-config.component.html"
})

export class UserConfigComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public userConfigForm: FormGroup;

    constructor(private service: UserService,
        private formBuilder: FormBuilder,
        private snackBar: MdSnackBar) { }

    public ngOnInit(): void {     
        this.initUserConfigForm();
        this.sub = this.service.getConfig()
            .subscribe(data => this.parse(data),
                error => console.log(error));
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
    }

    public onSubmit(): void {
        const userConfig: UserConfig = this.userConfigForm.value;
        this.service.updateConfig(userConfig)
            .subscribe(data => {
                if (data) {
                    this.snackBar.open("Настройки были успешно изменены", null, { duration: 5000 });
                } else {
                    this.snackBar.open("Не удалось сохранить настройки", null, { duration: 5000 });
                }
            });
    }

    private parse(item: UserConfig): void {
        this.userConfigForm.patchValue(item);
    }

    private initUserConfigForm(): void {
        this.userConfigForm = this.formBuilder.group({
            'isReplyToPmEnabled': ["", Validators.required],
            'isReplyToEmailEnabled': ["", Validators.required],
            'isPmToEmailNotifyEnabled': ["", Validators.required]
        });
    }
}