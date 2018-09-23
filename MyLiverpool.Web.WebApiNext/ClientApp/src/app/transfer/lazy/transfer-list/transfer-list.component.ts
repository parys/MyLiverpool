import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Subscription, merge, of, Observable } from "rxjs";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { TransferService } from "@app/transfer/core";
import { Transfer, TransferFilters } from "@app/transfer/model";
import { Pageable } from "@app/shared";
import { RolesCheckedService } from "@app/+auth";
import { TRANSFERS_ROUTE, PAGE } from "@app/+constants";
import { MatSort, MatPaginator } from "@angular/material";

@Component({
    selector: "transfer-list",
    templateUrl: "./transfer-list.component.html"
})
export class TransferListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public items: Transfer[];
    displayedColumns = ["personName", "clubName", "startDate", "onLoan", "amount"];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private service: TransferService,
        private route: ActivatedRoute,
        private location: Location,
        public roles: RolesCheckedService) {
    }

    public ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(qParams => {
            this.paginator.pageIndex = +qParams[PAGE] - 1 || 0;
            this.paginator.pageSize = +qParams["itemsPerPage"] || 15;

        },
            e => console.log(e));

       // merge(this.sort.sortChange,
        //        this.roleSelect.selectionChange,
       //         fromEvent(this.userInput.nativeElement, keyup),
       //         fromEvent(this.ipInput.nativeElement, keyup)
        //        .pipe(debounceTime(DEBOUNCE_TIME),
       //             distinctUntilChanged()))
      //      .subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange,
                this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    return this.update();
                }),
            map((data: Pageable<Transfer>) => {
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
        if (this.sub) { this.sub.unsubscribe(); }
        if (this.sub2) { this.sub2.unsubscribe(); }
    }


    public update(): Observable<Pageable<Transfer>> {
        const filters = new TransferFilters();
        filters.page = this.paginator.pageIndex + 1;
        filters.itemsPerPage = this.paginator.pageSize;
  //      filters.roleGroupId = this.roleSelect.value;
   //     filters.userName = this.userInput.nativeElement.value;
  //      filters.ip = this.ipInput.nativeElement.value;
        filters.sortBy = this.sort.active;
        filters.order = this.sort.direction;

        return this.service
            .getAll(filters);
    }

    public updateUrl(): void {
        let newUrl = `${TRANSFERS_ROUTE}?${PAGE}=${this.paginator.pageIndex + 1}`;
        this.location.replaceState(newUrl);
    };
}