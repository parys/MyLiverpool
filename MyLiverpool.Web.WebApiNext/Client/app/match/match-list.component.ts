import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MdDialog } from '@angular/material';
import { Subscription } from "rxjs/Subscription";
import { Match } from "./match.model";
import { MatchService } from "./match.service";
import { Pageable, DeleteDialogComponent } from "../shared/index";

@Component({
    selector: "match-list",
    templateUrl: "./match-list.component.html"
})

export class MatchListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public items: Match[];
    public page: number = 1;
    public itemsPerPage: number = 15;
    public totalItems: number;
    private categoryId: number;

    constructor(private matchService: MatchService,
        private route: ActivatedRoute,
        private location: Location,
        private dialog: MdDialog) {
    }

    public ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(qParams => {
                this.page = qParams["page"] || 1;
                this.categoryId = qParams["categoryId"] || "";
            },
            error => console.log(error));
        this.update();
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
        if(this.sub2) { this.sub2.unsubscribe(); }
    }

    public update(): void {
        this.sub2 = this.matchService
            .getAll(this.page)
            .subscribe(data => this.parsePageable(data),
                error => console.log(error));
    }

    public pageChanged(event: any): void {
        this.page = event;
        this.update();
        let newUrl = `matches?page=${this.page}`;
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

    private parsePageable(pageable: Pageable<Match>): void {
        this.items = pageable.list;
        this.page = pageable.pageNo;
        this.itemsPerPage = pageable.itemPerPage;
        this.totalItems = pageable.totalItems;
    }
}