import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Location } from "@angular/common";
import { MatPaginator, MatSort, MatSelect, MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { merge, of, Observable, fromEvent } from "rxjs";
import { startWith, switchMap, map, catchError, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { PersonService } from "@app/person/core";
import { Person, PersonType, PersonFilters } from "@app/person/model";
import { Pageable, DeleteDialogComponent } from "@app/shared";
import { KEYUP, DEBOUNCE_TIME, PERSONS_ROUTE, PAGE } from "@app/+constants";

@Component({
    selector: "person-list",
    templateUrl: "./person-list.component.html"
})

export class PersonListComponent implements OnInit {
    public items: Person[];
    public personTypes: PersonType[];
    displayedColumns = ["lastRussianName", "firstRussianName", "birthday", "position", "country"];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild("typeSelect") typeSelect: MatSelect;
    @ViewChild("nameInput") nameInput: ElementRef;

    constructor(private personService: PersonService,
        private route: ActivatedRoute,
        private location: Location,
        private dialog: MatDialog) {
    }

    public ngOnInit(): void {
        this.parseQueryParams();
        this.personService.getTypes().subscribe(data => this.personTypes = data, e => console.log(e));

        merge(this.sort.sortChange,
            this.typeSelect.selectionChange,
            fromEvent(this.nameInput.nativeElement, KEYUP)
                .pipe(debounceTime(DEBOUNCE_TIME),
                    distinctUntilChanged()))
            .subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page, this.typeSelect.selectionChange,
            fromEvent(this.nameInput.nativeElement, KEYUP)
                .pipe(debounceTime(DEBOUNCE_TIME),
                    distinctUntilChanged()))
            .pipe(
                startWith({}),
                switchMap(() => {
                    return this.update();
                }),
                map((data: Pageable<Person>) => {
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

    public showDeleteModal(index: number): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(index);
            }
        }, e => console.log(e));
    }

    public update(): Observable<Pageable<Person>> {
        const filters = new PersonFilters();
        filters.name = this.nameInput.nativeElement.value;
        filters.type = this.typeSelect.value;
        filters.page = this.paginator.pageIndex + 1;
        filters.itemsPerPage = this.paginator.pageSize;
        filters.sortBy = this.sort.active;
        filters.order = this.sort.direction;

        return this.personService
            .getAll(filters);
    }

    public setAsBestPlayer(personId: number): void {
        this.personService.setBestPlayer(personId)
            .subscribe(data => data,
                e => console.log(e));
    }

    private updateUrl(): void {
        let newUrl = `${PERSONS_ROUTE}?${PAGE}=${this.paginator.pageIndex + 1}`;

        const name = this.nameInput.nativeElement.value;
        if (name) {
            newUrl = `${newUrl}&name=${name}`;
        }
        const typeId = this.typeSelect.value;
        if (typeId) {
            newUrl = `${newUrl}&typeId=${typeId}`;
        }

        this.location.replaceState(newUrl);

    }

    private delete(index: number): void {
        let result: boolean;
        this.personService.delete(this.items[index].id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.items.splice(index, 1);
                        this.paginator.length -= 1;
                    }
                });
    }

    private parseQueryParams(): void {
        this.paginator.pageIndex = +this.route.snapshot.queryParams["page"] - 1 || 0;
        this.paginator.pageSize = +this.route.snapshot.queryParams["itemsPerPage"] || 15;
        this.nameInput.nativeElement.value = this.route.snapshot.queryParams["name"] || null;
        this.typeSelect.value = +this.route.snapshot.queryParams["typeId"] || null;
    }
}