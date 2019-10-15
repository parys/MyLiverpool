import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Transfer, Season, SeasonFilters, PagedList } from '@domain/models';
import { TRANSFERS_ROUTE } from '@constants/routes.constants';
import { DEBOUNCE_TIME } from '@constants/app.constants';
import { TransferService } from '@transfers/transfer.service';

@Component({
    selector: 'transfer-edit',
    templateUrl: './transfer-edit.component.html'
})

export class TransferEditComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub3: Subscription;
    private id: number;
    public editTransferForm: FormGroup;
    public seasons$: Observable<Season[]>;

    constructor(private transferService: TransferService,
                private route: ActivatedRoute,
                private router: Router,
                private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.initForm();
        const id: number = this.route.snapshot.params.id;

        if (id > 0) {
            this.sub3 = this.transferService.getSingle(id)
                .subscribe((data: Transfer) => this.parse(data));
        }
    }

    public ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
        if (this.sub3) { this.sub3.unsubscribe(); }
    }

    public onSubmit(): void {
        const transfer: Transfer = this.parseForm(); // todo bug should be fixed
        transfer.startDate = new Date(transfer.startDate);
        transfer.startDate = new Date(transfer.startDate.getFullYear(),
            transfer.startDate.getMonth(),
            transfer.startDate.getDate(),
            (-1) * transfer.startDate.getTimezoneOffset() / 60);
        if (transfer.finishDate != null) {
            transfer.finishDate = new Date(transfer.finishDate);
            transfer.finishDate = new Date(transfer.finishDate.getFullYear(),
                transfer.finishDate.getMonth(),
                transfer.finishDate.getDate(),
                (-1) * transfer.finishDate.getTimezoneOffset() / 60);
        }
        this.transferService.createOrUpdate(this.id, transfer)
            .subscribe((data: Transfer) => this.router.navigate([TRANSFERS_ROUTE]));
    }

    private parse(data: Transfer): void {
        this.id = data.id;
        data.startDate = new Date(data.startDate);
        if (data.finishDate) {
            data.finishDate = new Date(data.finishDate);
        }
        this.editTransferForm.patchValue(data);
    }

    private parseForm(): Transfer {
        const item = this.editTransferForm.value;
        item.id = this.id;

        return item;
    }

    private initForm(): void {
        this.editTransferForm = this.formBuilder.group({
            clubName: [''],
            clubId: [''],
            seasonId: ['', Validators.required],
            seasonName: [''],
            personId: ['', Validators.required],
            personName: [''],
            startDate: [null, Validators.required],
            finishDate: [null],
            amount: [null],
            onLoan: [false, Validators.required],
            coming: [true, Validators.required],
        });
    }
}
