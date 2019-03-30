import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatPaginator } from "@angular/material";
import { merge, of, Observable } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { Wish, WishFilter } from "../../model";
import { WishService } from "../wish.service";
import { Pageable, DeleteDialogComponent } from "@app/shared";
import { RolesCheckedService } from "@app/+auth";
import { PAGE, WISHES_ROUTE } from "@app/+constants";

@Component({
    selector: "wish-list",
    templateUrl: "./wish-list.component.html",
    styleUrls: ["./wish-list.component.scss"]
})
export class WishListComponent implements OnInit {
    public items: Wish[];
    public categoryId: number;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private service: WishService,
        public roles: RolesCheckedService,
        private location: Location,
        private route: ActivatedRoute,
        private dialog: MatDialog) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(qParams => {
                this.paginator.pageIndex = +qParams[PAGE] - 1 || 0;
                this.paginator.pageSize = +qParams["itemsPerPage"] || 15;
                this.categoryId = +qParams["categoryId"];

            },
            e => console.log(e));

        merge(this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    return this.update();
                }),
                map((data: Pageable<Wish>) => {
                    this.paginator.pageIndex = data.pageNo - 1;
                    this.paginator.pageSize = data.itemPerPage;
                    this.paginator.length = data.totalItems;

                    return data.list;
                }),
                catchError(() => {
                    return of([]);
                })
            ).subscribe((data: Wish[]) => {
                    this.items = data;
                    this.updateUrl();
                },
                e => console.log(e));
    }

    public updateUrl(): void {
        const newUrl: string = `${WISHES_ROUTE}?${PAGE}=${this.paginator.pageIndex + 1}`;
        // if (this.categoryId) {
        //     newUrl = `${newUrl}&categoryId=${this.categoryId}`;
        //  }
        // if (this.userName) {
        //      newUrl = `${newUrl}&userName=${this.userName}`;
        //  }

        this.location.replaceState(newUrl);
    };

    public update(): Observable<Pageable<Wish>> {
        const filters = new WishFilter();
        filters.categoryId = this.categoryId;
        filters.itemsPerPage = this.paginator.pageSize;
        filters.page = this.paginator.pageIndex + 1;

        return this.service.getAll(filters);
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
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(index);
            }
        }, e => console.log(e));
    }

    private delete(index: number): void {
        this.service.delete(this.items[index].id)
            .subscribe((res: boolean) => {
                if (res) {
                    this.items.splice(index, 1);
                    this.paginator.length -= 1;
                }
            });
    }
}