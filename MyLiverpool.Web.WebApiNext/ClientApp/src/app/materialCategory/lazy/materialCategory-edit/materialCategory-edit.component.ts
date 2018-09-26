import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MaterialCategoryService } from "../../core";
import { MaterialType } from "../../model";
import { CustomTitleService } from "@app/shared";

@Component({
    selector: "materialCategory-edit",
    templateUrl: "./materialCategory-edit.component.html"
})
export class MaterialCategoryEditComponent implements OnInit, OnDestroy {
    public editCategoryForm: FormGroup;
    private id: number = 0;
    private sub: Subscription;
    private type: MaterialType;

    constructor(private service: MaterialCategoryService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router,
        private titleService: CustomTitleService,
        private route: ActivatedRoute) {
        if (this.router.url.startsWith("/newsCategories")) {
            this.titleService.setTitle("Категории новостей");
            this.type = MaterialType.News;
        } else if (this.router.url.startsWith("/blogCategories")) {
            this.titleService.setTitle("Категории блогов");
            this.type = MaterialType.Blogs;
        } 
    }

    public ngOnInit(): void {
        this.editCategoryForm = this.formBuilder.group({
            name: ["", Validators.required],
            description: [""]
        });
        this.sub = this.route.params.subscribe(params => {
            this.id = +params["id"];
            if (this.id > 0) {
                this.service
                    .getSingle(this.id)
                    .subscribe(data => this.editCategoryForm.patchValue(data),
                        error => console.log(error));
            }
        });
    }

    public ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public onSubmit(): void {
        const model = this.editCategoryForm.value;
        model.id = this.id;

        if (this.id > 0) {
            this.service.update(this.id, model).subscribe(data => {
                if (data) {
                    this.snackBar.open("Категория обновлена", null);
                }
            }, e => console.log(e));
        } else {
            this.service.create(model, this.type).subscribe(data => {
                if (data) {
                    this.snackBar.open("Категория создана", null);
                }
            }, e => console.log(e));
        }
    }
}