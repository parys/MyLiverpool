import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Pm, User, UserFilters, PagedList } from '@domain/models';
import { PmService } from '@pms/pm.service';

@Component({
    selector: 'pm-edit',
    templateUrl: './pm-edit.component.html'
})
export class PmEditComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public editPmForm: FormGroup;
    public id = 0;
    public debounceTime = 600;
    public users$: Observable<User[]>;

    constructor(private service: PmService,
                private formBuilder: FormBuilder,
                private snackBar: MatSnackBar
    ) {
    }

    public ngOnInit(): void {
        this.editPmForm = this.formBuilder.group({
            receiverId: ['', Validators.required],
            receiver: ['', Validators.required],
            title: [
                '', Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ],
            message: [
                '', Validators.compose([
                    Validators.required,
                    Validators.maxLength(2500)
                ])
            ]
        });

        this.users$ = this.editPmForm.controls.receiver.valueChanges.pipe(
            debounceTime(this.debounceTime),
            distinctUntilChanged(),
            switchMap((value: string) => {
                const filter = new UserFilters();
                filter.userName = value;
                return this.service.getUsers(filter);
            }),
            switchMap((value: PagedList<User>) => of(value.results))
            );
    }

    public ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
    }

    public selectUser(id: number) {
        this.editPmForm.get('receiverId').patchValue(id);
    }

    public onSubmit(): void {
        const model: Pm = this.editPmForm.value;

        this.sub = this.service.create(model).subscribe(data => {
            this.editPmForm.patchValue({ message: '' });
            this.snackBar.open('Сообщение отправлено');
            });
    }
}
