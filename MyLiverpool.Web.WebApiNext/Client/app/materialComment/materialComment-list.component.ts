import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Location } from "@angular/common";
import { MdDialog } from '@angular/material';
import { Subscription } from "rxjs/Subscription";
import { MaterialComment } from "./materialComment.model";
import { MaterialCommentService } from "./materialComment.service";
import { RolesCheckedService, IRoles, DeleteDialogComponent, Pageable } from "../shared/index";
import { MaterialCommentFilter } from "./materialCommentFilter.model";

@Component({
    selector: "materialComment-list",
    templateUrl: "./materialComment-list.component.html"
})
export class MaterialCommentListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public filterForm: FormGroup;
    public items: MaterialComment[];
    public page: number = 1;
    public onlyUnverified: boolean = false;
    public categoryId: number;
    public userName: string;
    public userId: number;
    public itemsPerPage: number = 50;
    public totalItems: number;
    public roles: IRoles;

    constructor(private materialCommentService: MaterialCommentService,
        private route: ActivatedRoute,
        private location: Location,
        private formBuilder: FormBuilder,
        private rolesChecked: RolesCheckedService,
        private dialog: MdDialog) {
    }

    public ngOnInit(): void {
        this.initForm();
        this.roles = this.rolesChecked.checkRoles();
        this.sub = this.route.queryParams.subscribe(qParams => {
                this.page = qParams["page"] || 1;
                this.categoryId = qParams["categoryId"] || "";
                this.userName = qParams["userName"] || "";
                this.userId = qParams["userId"];
                this.onlyUnverified = qParams["onlyUnverified"] || false;
            },
            error => console.log(error));
        this.update();
    }

    public ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
        if (this.sub2) this.sub2.unsubscribe();
    }

    public pageChanged(event: any): void {
        this.page = event;
        this.update();
    };

    public update(): void {
        let filters = new MaterialCommentFilter();
        filters.onlyUnverified = this.filterForm.get("onlyUnverified").value;
        filters.userId = this.userId;
        filters.page = this.page;
        this.sub2 = this.materialCommentService
            .getAll(filters)
            .subscribe(data => this.parsePageable(data),
                error => console.log(error),
                () => { this.updateLocation(); });
    }

    private updateLocation(): void {
        let newUrl = `materialComments?page=${this.page}`;
        if (this.userId) {
            newUrl = `${newUrl}&userId=${this.userId}`;
        }
        if (this.onlyUnverified) {
            newUrl = `${newUrl}&onlyUnverified=${this.onlyUnverified}`;
        }
        this.location.replaceState(newUrl);
    }

    private parsePageable(pageable: Pageable<MaterialComment>): void {
        this.items = pageable.list;
        this.page = pageable.pageNo;
        this.itemsPerPage = pageable.itemPerPage;
        this.totalItems = pageable.totalItems;
    }

    public verify(index: number): void {
        let result: boolean;
        this.materialCommentService
            .verify(this.items[index].id)
            .subscribe(data => result = data,
                error => console.log(error),
                () => {
                    if (result) {
                        this.items[index].isVerified = true;
                    }
                });
    }

    private showDeleteModal(index: number): void {
        let dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.delete(index);
                }
            },
            e => console.log(e));
    }

    private delete(index: number): void {
        let result: boolean;
        this.materialCommentService.delete(this.items[index].id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.items.splice(index, 1);
                        this.totalItems -= 1;
                    }
                });
    }

    private initForm(): void {
        this.filterForm = this.formBuilder.group({
            'onlyUnverified': [this.onlyUnverified]
        });
    }
}