import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Season } from '@domain/models';
import { SEASONS_ROUTE } from '@constants/index';

import { SeasonService } from '@seasons/season.service';

@Component({
    selector: 'season-edit',
    templateUrl: './season-edit.component.html'
})
export class SeasonEditComponent implements OnInit, OnDestroy {
    private sub2: Subscription;
    public editForm: FormGroup;
    public id: number;

    constructor(private service: SeasonService,
                private formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.editForm = this.formBuilder.group({
            startSeasonYear: ['', Validators.required]
        });
        this.id = this.route.snapshot.params.id || 0;
        if (this.id > 0) {
            this.sub2 = this.service
                .getSingle(this.id)
                .subscribe((data: Season) => this.editForm.patchValue(data));
        }
    }

    public ngOnDestroy(): void {
        if (this.sub2) { this.sub2.unsubscribe(); }
    }

    public onSubmit(): void {
        const model: Season = this.editForm.value;
        model.id = this.id;

        this.service.createOrUpdate(this.id, model)
            .subscribe((data: Season) => {
                this.router.navigate([SEASONS_ROUTE]);
            });
    }
}
