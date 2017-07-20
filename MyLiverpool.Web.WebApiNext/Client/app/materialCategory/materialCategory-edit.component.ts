import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MaterialCategory } from "./materialCategory.model";
import { MaterialCategoryService } from "./materialCategory.service";
import { MaterialType } from "./materialType.enum";

@Component({
    selector: "materialCategory-edit",
    templateUrl: "./materialCategory-edit.component.html"
})
export class MaterialCategoryEditComponent implements OnInit, OnDestroy {
    editForm: FormGroup;
    id: number = 0;
    private sub: Subscription;
    type: MaterialType;

    constructor(private service: MaterialCategoryService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
        if (route.snapshot.data["type"] === MaterialType[MaterialType.News]) {
            this.type = MaterialType.News;
        } else {
            this.type = MaterialType.Blogs;
        }
    }

    ngOnInit() {
        this.editForm = this.formBuilder.group({
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
                        () => {});
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onSubmit(): void {
        let model = new MaterialCategory();
        model.id = this.id;
        model.name = this.editForm.controls["name"].value;
        model.description = this.editForm.controls["description"].value;
    //    model.type = 

        let res;
        if (this.id > 0) {
            this.service.update(this.id, model).subscribe(data => res = data);
        } else {
            this.service.create(model, this.type).subscribe(data => res = data);
        }
    }
}