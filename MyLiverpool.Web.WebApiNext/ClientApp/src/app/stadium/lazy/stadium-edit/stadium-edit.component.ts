import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { StadiumService } from "../../core";
import { Stadium } from "../../model";
import { STADIUMS_ROUTE } from "@app/+constants";

@Component({
    selector: "stadium-edit",
    templateUrl: "./stadium-edit.component.html"
})

export class StadiumEditComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    private id: number;
    public editForm: FormGroup;

    constructor(private service: StadiumService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.initForm();
        this.id = +this.route.snapshot.params["id"] || 0;
        if (this.id > 0) {
            this.sub2 = this.service.getSingle(this.id)
                .subscribe((data: Stadium) => this.parse(data));
        }
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
        if(this.sub2) { this.sub2.unsubscribe(); }
    }

    public onSubmit(): void {
        const stadium = this.editForm.value;
        this.service.createOrUpdate(this.id, stadium)
            .subscribe((data: Stadium) => this.router.navigate([STADIUMS_ROUTE]));
    }

    private parse(data: Stadium): void {
        this.id = data.id;
        this.editForm.patchValue(data);
    }

    private initForm(): void {
        this.editForm = this.formBuilder.group({
            name: ["", Validators.required],
            city: ["", Validators.required],
            id: [0, Validators.required]
        });
    }
}