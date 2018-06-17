﻿import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { TransferService } from "./transfer.service";
import { Transfer } from "./transfer.model";
import { RolesCheckedService, Pageable } from "@app/shared";

@Component({
    selector: "<transfer-list>",
    templateUrl: "./transfer-list.component.html"
})
export class TransferListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public items: Transfer[];
    public page: number = 1;
    public itemsPerPage: number = 15;
    public totalItems: number;

    constructor(private service: TransferService,
        private route: ActivatedRoute,
        private location: Location,
        public roles: RolesCheckedService) {
    }

    public ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(qParams => {
                this.page = qParams["page"] || 1;
            },
            e => console.log(e));
        this.update();
    }

    public ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
        if (this.sub2) { this.sub2.unsubscribe(); }
    }


    public update(): void {
        this.sub2 = this.service
            .getAll(this.page)
            .subscribe(data => this.parsePageable(data),
                error => console.log(error));
    }

    public pageChanged(event: any): void {
        this.page = event;
        this.update();
        let newUrl = `transfers?page=${this.page}`;
        this.location.replaceState(newUrl);
    };

    private parsePageable(pageable: Pageable<Transfer>): void {
        this.items = pageable.list;
        this.page = pageable.pageNo;
        this.itemsPerPage = pageable.itemPerPage;
        this.totalItems = pageable.totalItems;
    }
}