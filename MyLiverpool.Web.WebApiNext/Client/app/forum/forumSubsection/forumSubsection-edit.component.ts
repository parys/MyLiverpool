import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { ForumSubsection } from "./forumSubsection.model";
import { ForumSubsectionService } from "./forumSubsection.service";
import { ForumSectionService, ForumSection } from "../forumSection/index";

@Component({
    selector: "forumSubsection-edit",
    templateUrl: "forumSubsection-edit.component.html"
})
export class ForumSubsectionEditComponent implements OnInit, OnDestroy {

    editForm: FormGroup;
    id: number = 0;
    private sub: Subscription;
    forumSections: ForumSection[];

    constructor(private service: ForumSubsectionService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private sectionService: ForumSectionService) {
    }

    ngOnInit() {
        this.editForm = this.formBuilder.group({
            'sectionId': [
                "", Validators.compose([
                    Validators.required
                ])
            ],
            'name': [
                "", Validators.compose([
                    Validators.required
                ])
            ],
            'description': [
                "", Validators.compose([
                    Validators.required
                ])
            ]
        });
        this.sub = this.route.params.subscribe(params => {
            this.id = +params["id"];
            if (this.id > 0) {
                this.service
                    .getSingle(this.id)
                    .subscribe(data => this.editForm.patchValue(data),
                    error => console.log(error),
                    () => { });
            }
        });
        this.sectionService.getAll()
            .subscribe(data => this.forumSections = data,
                error => console.log(error),
                () => {});
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onSubmit(): void {
        let model = new ForumSubsection();
        model.id = this.id;
        model.sectionId = this.editForm.controls["sectionId"].value;
        model.name = this.editForm.controls["name"].value;
        model.description = this.editForm.controls["description"].value;

        let res;
        if (this.id > 0) {
            let result = this.service.update(this.id, model).subscribe(data => res = data);
        } else {
            let result = this.service.create(model).subscribe(data => res = data);
        }
        if (res !== null) {

        } 
    }
}