import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MdDialog } from '@angular/material';
import { Subscription } from "rxjs/Subscription";
import { Wish } from "./wish.model";
import { WishService } from "./wish.service";
import { Pageable, RolesCheckedService, IRoles, DeleteDialogComponent } from "../shared/index";

@Component({
    selector: "wish-list",
    templateUrl: "./wish-list.component.html"
})
export class WishListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public roles: IRoles;
    public items: Wish[];
    public page: number = 1;
    public itemsPerPage: number = 15;
    public totalItems: number;
    public categoryId: number;

    constructor(private service: WishService,
        private rolesChecked: RolesCheckedService,
        private location: Location,
        private route: ActivatedRoute,
        private dialog: MdDialog) {
    }

    public ngOnInit(): void  {
        this.roles = this.rolesChecked.checkRoles();   
        this.sub = this.route.params.subscribe(params => {
            if (params["page"]) {
                this.page = +params["page"];
            }
            this.categoryId = +params["categoryId"];
            this.update();
        });
    }

    public ngOnDestroy(): void  {
        if(this.sub) { this.sub.unsubscribe(); }
        if(this.sub2) { this.sub2.unsubscribe(); }
    }

    public pageChanged(event: any): void {
        this.page = event;
        this.update();
        const newUrl: string = `$wishes?page=${this.page}`;
       // if (this.categoryId) {
       //     newUrl = `${newUrl}&categoryId=${this.categoryId}`;
      //  }
       // if (this.userName) {
      //      newUrl = `${newUrl}&userName=${this.userName}`;
      //  }

        this.location.replaceState(newUrl);
    };

    public update(): void {
        //let filters = new MaterialFilters();
        //filters.categoryId = this.categoryId;
        //filters.materialType = "News";
        //filters.userName = this.userName;
        //filters.page = this.page;

        this.sub2 = this.service
            .getAll(this.page)
            .subscribe(data => this.parsePageable(data),
            error => console.log(error));
    }

    public getTypeClass(i: number): string {
        switch (i) {
            case 1:
                return "panel-danger";
            case 2:
                return "panel-success";
            case 3:
                return "panel-info";
            case 4:
                return "panel-primary";
            default:
                return "";
        }
    };

    public showDeleteModal(index: number): void {
        let dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(index);
            }
        }, e => console.log(e));
    }

    private delete(index: number): void {
        let result: boolean;
        this.service.delete(this.items[index].id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.items.splice(index, 1);
                        this.totalItems -= 1;
                    }
                });
    }

    private parsePageable(pageable: Pageable<Wish>): void {
        this.items = pageable.list;
        this.page = pageable.pageNo;
        this.itemsPerPage = pageable.itemPerPage;
        this.totalItems = pageable.totalItems;
    }
}