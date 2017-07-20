import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { StadiumService } from "./stadium.service";
import { Stadium } from "./stadium.model";

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
                .subscribe(data => this.parse(data),
                    error => console.log(error));
        }
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
        if(this.sub2) { this.sub2.unsubscribe(); }
    }

    public onSubmit(): void {
        let stadium = this.editForm.value;
        if (this.id > 0) {
            this.service.update(this.id, stadium)
                .subscribe(data => this.router.navigate(["/stadiums"]),
                    error => console.log(error));
        } else {
            this.service.create(stadium)
                .subscribe(data => this.router.navigate(["/stadiums"]),
                    error => console.log(error));
        }
    }

    private parse(data: Stadium): void {
        this.id = data.id;
        this.editForm.patchValue(data);
    }

    private initForm(): void {
        this.editForm = this.formBuilder.group({
            'name': ["", Validators.required],
            'city': ["", Validators.required],
            'id': [0, Validators.required]
        });
    }
}