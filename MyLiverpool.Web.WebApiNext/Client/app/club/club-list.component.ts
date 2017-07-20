import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MdDialog } from '@angular/material';
import { Club } from "./club.model";
import { ClubService } from "./club.service";
import { Pageable, DeleteDialogComponent } from "../shared/index";

@Component({
    selector: "club-list",
    templateUrl: "./club-list.component.html"
})

export class ClubListComponent implements OnInit {
    public items: Club[];
    public page: number = 1;
    public itemsPerPage: number = 15;
    public totalItems: number;
    //categoryId: number;
    public userName: string;

    constructor(private clubService: ClubService,
        private route: ActivatedRoute,
        private location: Location,
        private dialog: MdDialog) {
    }

    public ngOnInit(): void {
        if(+this.route.snapshot.queryParams["page"]) {
            this.page = +this.route.snapshot.queryParams["page"];
            }
            //  this.categoryId = +params['categoryId'];
            //  this.userName = params['userName'];
            this.update();
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
        //let filters = new UserFilters();
        ////  filters.categoryId = this.categoryId;
        ////  filters.materialType = "News";
        //filters.userName = this.userName;
        //filters.page = this.page;

        this.clubService
            .getAll(this.page)
            .subscribe(data => this.parsePageable(data),
            error => console.log(error));
    }

    public pageChanged(event: any): void {
        this.page = event;
        this.update();
        let newUrl = `clubs?page=${this.page}`;
        //if (this.categoryId) {
       //     newUrl = `${newUrl}/${this.categoryId}`;
       // }
        this.location.replaceState(newUrl);
    };

    private delete(index: number): void {
        let result: boolean;
        this.clubService.delete(this.items[index].id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.items.splice(index, 1);
                    }
                }
            );
    }

    private parsePageable(pageable: Pageable<Club>): void {
        this.items = pageable.list;
        this.page = pageable.pageNo;
        this.itemsPerPage = pageable.itemPerPage;
        this.totalItems = pageable.totalItems;
    }
}