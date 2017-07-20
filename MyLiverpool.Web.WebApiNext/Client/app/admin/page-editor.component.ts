import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MdSnackBar } from "@angular/material";
import { Subscription } from "rxjs/Subscription";
import { AdminService } from "./admin.service";
import { HelperType } from "./helperType.enum";
import { RolesCheckedService, IRoles } from "../shared/index";

@Component({
    selector: "page-editor",
    templateUrl: "./page-editor.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PageEditorComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    private id: number;
    public roles: IRoles;
    public title: string;
    public editPageForm: FormGroup;
    public content: string;
    

    constructor(private service: AdminService,
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private snackBar: MdSnackBar,
        private rolesChecked: RolesCheckedService,
        private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.roles = this.rolesChecked.checkRoles();
        this.initForm();
        this.sub = this.route.params.subscribe(data => {
                this.id = +data["id"];
                if (this.id > 0) {
                    this.title = HelperType[this.id];
                    this.sub2 = this.service.getValue(this.id).subscribe(pageData => {
                            if (pageData) {
                                this.content = pageData;
                                this.editPageForm.get("content").patchValue(pageData);
                            }
                        },
                        e => console.log(e));
                }
            },
            e => console.log(e));
        // HelperType.f
    }

    public ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
    }
    
    private initForm(): void {
        this.editPageForm = this.formBuilder.group({
            'content': ["", Validators.required]
        });
        this.editPageForm.valueChanges.subscribe(_ => this.cd.markForCheck());
    }

    public onSubmit(): void {
        let model: string = this.editPageForm.controls["content"].value;
        
        this.service.updateValue(this.id, model).subscribe(data => {
            if (data) {
                this.snackBar.open("Страница успешно обновлена.", null, { duration: 5000 });
            } else {
                this.snackBar.open("Страница НЕ БЫЛА обновлена.", null, { duration: 5000 });
            }
        });
    }
}