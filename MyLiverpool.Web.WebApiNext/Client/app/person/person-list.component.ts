import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MdDialog } from '@angular/material';
import { Subscription } from "rxjs/Subscription";
import { Person } from "./person.model";
import { PersonService } from "./person.service";
import { Pageable, DeleteDialogComponent } from "../shared/index";

@Component({
    selector: "person-list",
    templateUrl: "./person-list.component.html"
})

export class PersonListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public items: Person[];
    public page: number = 1;
    public itemsPerPage: number = 15;
    public totalItems: number;
    private userName: string;

    constructor(private personService: PersonService,
        private route: ActivatedRoute,
        private location: Location,
        private dialog: MdDialog) {
    }

    public ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(qParams => {
                this.page = qParams["page"] || 1;
                this.userName = qParams["userName"] || "";
            },
            error => console.log(error));
        this.update();
    }

    public ngOnDestroy(): void {
        if(this.sub) this.sub.unsubscribe();
        if(this.sub2) this.sub2.unsubscribe();
    }

    public showDeleteModal(index: number): void {
        let dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(index);
            }
        }, e => console.log(e));
    }

    public update(): void {
        this.sub2 = this.personService
            .getAll(this.page)
            .subscribe(data => this.parsePageable(data),
            error => console.log(error));
    }

    public pageChanged(event: any): void {
        this.page = event;
        this.update();
        let newUrl = `persons?page=${this.page}`;
        this.location.replaceState(newUrl);
    };

    public setAsBestPlayer(personId: number): void {
        this.personService.setBestPlayer(personId)
            .subscribe(data => data,
            error => console.log(error));
    }

    private delete(index: number): void {
        let result: boolean;
        this.personService.delete(this.items[index].id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.items.splice(index, 1);
                        this.totalItems -= 1;
                    }
                });
    }

    private parsePageable(pageable: Pageable<Person>): void {
        this.items = pageable.list;
        this.page = pageable.pageNo;
        this.itemsPerPage = pageable.itemPerPage;
        this.totalItems = pageable.totalItems;
    }
}