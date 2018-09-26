import { Component, OnInit, OnDestroy, ViewChild, ElementRef  } from "@angular/core"; 
import { Location } from "@angular/common";
import { MatPaginator, MatSort, MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { merge, of, fromEvent, Observable, Subscription } from "rxjs";
import { startWith, switchMap, map, catchError, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Injury, InjuryFilters } from "@app/injury/model";
import { InjuryService } from "@app/injury/core";
import { Pageable, DeleteDialogComponent } from "@app/shared";
import { DEBOUNCE_TIME, INJURIES_ROUTE, KEYUP, PAGE } from "@app/+constants";

@Component({
    selector: "injury-list",
    templateUrl: "./injury-list.component.html"
})

export class InjuryListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public items: Injury[];
    displayedColumns = ["personName", "startTime", "endTime", "description", "tool"];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild("nameInput") nameInput: ElementRef;

    constructor(private injuryService: InjuryService,
        private route: ActivatedRoute,
        private location: Location,
        private dialog: MatDialog) {
    }

    public ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(qParams => {
            this.paginator.pageIndex = +qParams[PAGE] - 1 || 0;
            },
            e => console.log(e));

        merge(this.sort.sortChange,
            fromEvent(this.nameInput.nativeElement, KEYUP)
                .pipe(debounceTime(DEBOUNCE_TIME),
                    distinctUntilChanged()))
            .subscribe(() => this.paginator.pageIndex = 0);


        merge(this.sort.sortChange, this.paginator.page, fromEvent(this.nameInput.nativeElement, KEYUP)
            .pipe(debounceTime(DEBOUNCE_TIME),
                    distinctUntilChanged()))
            .pipe(
                startWith({}),
                switchMap(() => {
                    return this.update();
                }),
                map((data: Pageable<Injury>) => {
                    this.paginator.pageIndex = data.pageNo - 1;
                    this.paginator.pageSize = data.itemPerPage;
                    this.paginator.length = data.totalItems;

                    return data.list;
                }),
                catchError(() => {
                    return of([]);
                })
            ).subscribe((data: Injury[]) => {
                    this.items = data;
                    this.updateUrl();
                },
                e => console.log(e));
    }

    public ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
    }

    public showDeleteModal(injury: Injury): void {
        let dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(injury.id);
            }
        }, e => console.log(e));
    }

    public update(): Observable<Pageable<Injury>> {
        const filters = new InjuryFilters();
        filters.name = this.nameInput.nativeElement.value;
        filters.page = this.paginator.pageIndex + 1;
        filters.itemsPerPage = this.paginator.pageSize;
        filters.sortBy = this.sort.active;
        filters.order = this.sort.direction;

        return this.injuryService
            .getAll(filters);
    }

    public updateUrl(): void {
        const newUrl = `${INJURIES_ROUTE}?${PAGE}=${this.paginator.pageIndex + 1}`;
        this.location.replaceState(newUrl);
    };
    
    private delete(index: number): void {
        let result: boolean;
        this.injuryService.delete(this.items[index].id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.items.splice(index, 1);
                        this.paginator.length -= 1;
                    }
                });
    }
}