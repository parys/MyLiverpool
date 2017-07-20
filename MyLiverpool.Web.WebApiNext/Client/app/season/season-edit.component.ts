import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Season } from "./season.model";
import { SeasonService } from "./season.service";

@Component({
    selector: "season-edit",
    templateUrl: "./season-edit.component.html"
})
export class SeasonEditComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public editForm: FormGroup;
    public id: number = 0;

    constructor(private service: SeasonService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute) {
    }

    public ngOnInit() : void {
        this.editForm = this.formBuilder.group({
            'startSeasonYear': ["", Validators.required]
        });
        this.sub = this.route.queryParams.subscribe(qParams => {
            this.id = qParams["id"] || 0;
        }, e => console.log(e));
        if (this.id > 0) {
            this.sub2 = this.service
                .getSingle(this.id)
                .subscribe(data => this.editForm.patchValue(data),
                    error => console.log(error));
        }
    };

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
        if(this.sub2) { this.sub2.unsubscribe(); }
    }

    public onSubmit(): void {
        let model: Season = new Season();
        model.id = this.id;
        model.startSeasonYear = this.editForm.controls["startSeasonYear"].value;

        let res: Season;
        if (this.id > 0) {
            this.service.update(this.id, model).subscribe((data: Season) => res = data);
        } else {
            this.service.create(model).subscribe(data => res = data);
        }
        this.router.navigate(["/seasons"]);
    }
}