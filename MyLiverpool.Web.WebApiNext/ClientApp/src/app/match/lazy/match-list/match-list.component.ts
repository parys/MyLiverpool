import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatPaginator } from "@angular/material";
import { Subscription, merge, of, Observable } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";

import { Match, MatchFilters } from "@app/match/model";
import { MatchService } from "@app/match/core";
import { Pageable, DeleteDialogComponent } from "@app/shared";
import { PAGE, MATCHES_ROUTE } from "@app/+constants/";

@Component({
    selector: "match-list",
    templateUrl: "./match-list.component.html",
    styleUrls: ["./match-list.component.scss"]
})

export class MatchListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public items: Match[];
    private categoryId: number;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private matchService: MatchService,
        private route: ActivatedRoute,
        private location: Location,
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
                map((data: Pageable<Match>) => {
                    this.paginator.pageIndex = data.pageNo - 1;
                    this.paginator.pageSize = data.itemPerPage;
                    this.paginator.length = data.totalItems;

                    return data.list;
                }),
                catchError(() => {
                    return of([]);
                })
            ).subscribe(data => {
                    this.items = data;
                    this.updateUrl();
                },
                e => console.log(e));
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
        if(this.sub2) { this.sub2.unsubscribe(); }
    }

    public update(): Observable<Pageable<Match>>  {
        let filters = new MatchFilters();
        filters.categoryId = this.categoryId;
        filters.itemsPerPage = this.paginator.pageSize;
        filters.page = this.paginator.pageIndex + 1;

        return this.matchService
            .getAll(filters);
    }

    public updateUrl(): void {
        const newUrl = `${MATCHES_ROUTE}?${PAGE}=${this.paginator.pageIndex}`;
        this.location.replaceState(newUrl);
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
        this.matchService.delete(this.items[index].id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.items.splice(index, 1);
                    }
                }
            );
    }
}