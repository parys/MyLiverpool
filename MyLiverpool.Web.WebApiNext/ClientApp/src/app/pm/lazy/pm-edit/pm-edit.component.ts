import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Observable, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Pm } from "../../model";
import { PmService } from "../../core";
import { User } from "@app/user";

@Component({
    selector: "pm-edit",
    templateUrl: "./pm-edit.component.html"
})
export class PmEditComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public editPmForm: FormGroup;
    public id: number = 0;
    public debounceTime: number = 600;
    public users$: Observable<User[]>;

    constructor(private service: PmService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
   //     private userService: UserService
    ) {
    }

    public ngOnInit(): void {
        this.editPmForm = this.formBuilder.group({
            receiverId: ["", Validators.required],
            receiver: ["", Validators.required],
            title: [
                "", Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ],
            message: [
                "", Validators.compose([
                    Validators.required,
                    Validators.maxLength(2500)
                ])
            ]
        });
        
        this.users$ = this.editPmForm.controls["receiver"].valueChanges.pipe(
            debounceTime(this.debounceTime),
            distinctUntilChanged(),
            switchMap((value: string) => this.service.getListByUserName(value)));
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
    }
    
    public selectUser(id: number) {
        this.editPmForm.get("receiverId").patchValue(id);
    }

    public onSubmit(): void {
        const model: Pm = this.editPmForm.value;

        this.sub = this.service.create(model).subscribe(data => {
            this.editPmForm.patchValue({ message: "" });
                this.snackBar.open("Сообщение отправлено");
            },
            e => console.log(e));
    }
}