import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MatPaginator, MatSort, MatDialog } from "@angular/material";
import { merge, of, Observable, fromEvent } from "rxjs";
import { startWith, switchMap, map, catchError, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ClubService } from "@app/club/core";
import { Club, ClubFilters } from "@app/club/model";
import { Pageable, DeleteDialogComponent } from "@app/shared";
import { CLUBS_ROUTE, DEBOUNCE_TIME, KEYUP, PAGE } from "@app/+constants";

@Component({
    selector: "club-list",
    templateUrl: "./club-list.component.html",
    styleUrls: ["./club-list.component.scss"]
})
export class ClubListComponent implements OnInit {
    public items: Club[];
    displayedColumns = ["logo", "name", "englishName", "stadiumName", "tool"];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild("nameInput") nameInput: ElementRef;

    constructor(private clubService: ClubService,
        private route: ActivatedRoute,
        private location: Location,
        private dialog: MatDialog) {
    }

    public ngOnInit(): void {
        if (+this.route.snapshot.queryParams[PAGE]) {
            this.paginator.pageIndex = +this.route.snapshot.queryParams[PAGE] - 1;
        }

        merge(this.sort.sortChange,
                fromEvent(this.nameInput.nativeElement, KEYUP)
                .pipe(debounceTime(DEBOUNCE_TIME),
                    distinctUntilChanged()))
            .subscribe(() => this.paginator.pageIndex = 0);


        merge(this.sort.sortChange,
                this.paginator.page,
            fromEvent(this.nameInput.nativeElement, KEYUP)
                .pipe(debounceTime(DEBOUNCE_TIME),
                    distinctUntilChanged()))
            .pipe(
                startWith({}),
                switchMap(() => {
                    return this.update();
                }),
                map((data: Pageable<Club>) => {
                    this.paginator.pageIndex = data.pageNo - 1;
                    this.paginator.pageSize = data.itemPerPage;
                    this.paginator.length = data.totalItems;

                    return data.list;
                }),
                catchError(() => {
                    return of([]);
                })
            ).subscribe((data: Club[]) => {
                    this.items = data;
                    this.updateUrl();
                },
                e => console.log(e));
    }

    public showDeleteModal(index: number): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.delete(index);
                }
            },
            e => console.log(e));
    }

    public update(): Observable<Pageable<Club>> {
        const filters = new ClubFilters();
        filters.name = this.nameInput.nativeElement.value;
        filters.page = this.paginator.pageIndex + 1;
        filters.itemsPerPage = this.paginator.pageSize;
        filters.sortBy = this.sort.active;
        filters.order = this.sort.direction;

        return this.clubService
            .getAll(filters);
    }

    public updateUrl(): void {
        let newUrl = `${CLUBS_ROUTE}?${PAGE}=${this.paginator.pageIndex + 1}`;
        this.location.replaceState(newUrl);
    };

    private delete(index: number): void {
        this.clubService.delete(this.items[index].id)
            .subscribe((result: boolean) => {
                    if (result) {
                        this.items.splice(index, 1);
                        this.paginator.length -= 1;
                    }
                },
                e => console.log(e)
            );
    }
}