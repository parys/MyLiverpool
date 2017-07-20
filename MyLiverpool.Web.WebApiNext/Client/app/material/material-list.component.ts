import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { MdDialog, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { MaterialService } from "./material.service";
import { Material } from "./material.model";
import { MaterialFilters } from "./materialFilters.model";
import { RolesCheckedService, IRoles, DeleteDialogComponent,Pageable } from "../shared/index";
import { MaterialType } from "../materialCategory/materialType.enum";
import { MaterialActivateDialogComponent } from "./material-activate-dialog.component";

@Component({
    selector: "material-list",
    templateUrl: "./material-list.component.html"
})
export class MaterialListComponent implements OnInit, OnDestroy {
    private type: MaterialType;
    private sub: Subscription;
    private sub2: Subscription;
    private userName: string;
    private userId: number = null;
    public items: Material[];
    public page: number = 1;
    public itemsPerPage: number = 15;
    public totalItems: number;
    public categoryId: number;
    public roles: IRoles;

    constructor(private router: Router,
        private materialService: MaterialService,
        private route: ActivatedRoute,
        private location: Location,
        private rolesChecked: RolesCheckedService,
        private snackBar: MdSnackBar,
        private dialog: MdDialog) {

        if (route.snapshot.data["type"] === MaterialType[MaterialType.News]) {
            this.type = MaterialType.News;
        } else if (route.snapshot.data["type"] === MaterialType[MaterialType.Blogs]) {
            this.type = MaterialType.Blogs;
        } else {
            this.type = MaterialType.Both;
        }
        this.parseQueryParamsAndUpdate(route);
    }

    public showActivateModal(index: number): void {
        const dialogRef = this.dialog.open(MaterialActivateDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.activate(index);
            }
        }, e => console.log(e));
    }

    public showDeleteModal(index: number): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(index);
            }
        }, e => console.log(e));
    }

    public ngOnInit(): void {
        this.roles = this.rolesChecked.checkRoles();
    }

    public ngOnDestroy(): void {
        if(this.sub) this.sub.unsubscribe();
        if(this.sub2) this.sub2.unsubscribe();
    }

    public pageChanged(event: any): void {
        this.page = event;
        this.update();
        this.updateUrl();
    };

    private updateUrl(): void {
        let newUrl: string = `${MaterialType[this.type].toLowerCase()}?page=${this.page}`;
        if (this.categoryId) {
            newUrl = `${newUrl}&categoryId=${this.categoryId}`;
        }
        if (this.userName) {
            newUrl = `${newUrl}&userName=${this.userName}`;
        }

        this.location.replaceState(newUrl);
    }

    private activate(index: number): void {
        let result: boolean;

        const news: Material = this.items[index];
        this.materialService.activate(news.id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        news.pending = false;
                        this.snackBar.open("Материал успешно активирован", null, { duration: 5000 });
                    } else {
                        this.snackBar.open("Материал НЕ БЫЛ активирован", null, { duration: 5000 });
                    }
                }
            );
    }

    private delete(index: number): void {
        let result: boolean;
        this.materialService.delete(this.items[index].id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.items.splice(index, 1);
                    } else {
                        this.snackBar.open("Ошибка удаления", null, {duration: 5000});
                    }
                }
            );
    }

    private parsePageable(pageable: Pageable<Material>): void {
        this.items = pageable.list;
        this.page = pageable.pageNo;
        this.itemsPerPage = pageable.itemPerPage;
        this.totalItems = pageable.totalItems;
    }

    private update(): void {
        const filters: MaterialFilters = new MaterialFilters();
        filters.categoryId = this.categoryId || null;
        filters.materialType = MaterialType[this.type];
        filters.userName = this.userName || null;
        filters.userId = this.userId || null;
        filters.page = this.page;

        this.sub = this.materialService
            .getAll(filters)
            .subscribe(data => this.parsePageable(data),
                error => console.log(error));
    }

    private parseQueryParamsAndUpdate(route: ActivatedRoute): void {
        this.sub2 = route.queryParams.subscribe(qParams => {
                this.page = qParams["page"] || 1;
                this.categoryId = qParams["categoryId"] || "";
                this.userName = qParams["userName"] || "";
                this.userId = qParams["userId"] || null;
            },
            error => console.log(error));
        this.update();
    }
}