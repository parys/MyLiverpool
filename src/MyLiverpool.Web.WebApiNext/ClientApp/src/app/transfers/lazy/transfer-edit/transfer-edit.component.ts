﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { TransferService } from '@transfers/core';
import { Transfer, Club, ClubFilters, Season, SeasonFilters, PagedList } from '@domain/models';
import { ClubService } from '@clubs/core';
import { SeasonService } from '@seasons/core';
import { TRANSFERS_ROUTE } from '@constants/routes.constants';
import { DEBOUNCE_TIME } from '@constants/app.constants';

@Component({
    selector: 'transfer-edit',
    templateUrl: './transfer-edit.component.html'
})

export class TransferEditComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub3: Subscription;
    private id: number;
    public editTransferForm: FormGroup;
    public clubs$: Observable<Club[]>;
    public seasons$: Observable<Season[]>;

    constructor(private transferService: TransferService,
                private route: ActivatedRoute,
                private router: Router,
                private formBuilder: FormBuilder,
                private clubService: ClubService,
                private seasonService: SeasonService) {
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

    public selectSeason(id: number) {
        this.editTransferForm.get('seasonId').patchValue(id);
    }

    public selectClub(id: number) {
        this.editTransferForm.get('clubId').patchValue(id);
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
        if (!this.editTransferForm.get('clubName').value) {
            this.editTransferForm.get('clubId').patchValue('');
        }
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

        this.clubs$ = this.editTransferForm.controls['clubName'].valueChanges
            .pipe(
                debounceTime(DEBOUNCE_TIME),
                distinctUntilChanged(),
                switchMap((value: string): Observable<PagedList<Club>> => {
                    const filter = new ClubFilters();
                    filter.name = value;
                    return this.clubService.getAll(filter);
                }),
                switchMap((pagingClubs: PagedList<Club>): Observable<Club[]> => {
                    return of(pagingClubs.results);
                })
            );

        this.seasons$ = this.editTransferForm.controls['seasonName'].valueChanges.pipe(
            debounceTime(DEBOUNCE_TIME),
            distinctUntilChanged(),
            switchMap((value: string): Observable<PagedList<Season>> => {
                const filter = new SeasonFilters();
                filter.name = value;
                return this.seasonService.getAll(filter);
            }),
            switchMap((pagingSeasons: PagedList<Season>): Observable<Season[]> => {
                return of(pagingSeasons.results);
            }));
    }
}
