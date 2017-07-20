import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";   
import { Subscription } from "rxjs/Subscription";
import { ForumSubsectionService } from "./forumSubsection.service";
import { ForumSubsection } from "./forumSubsection.model";
import { ForumTheme } from "../forumTheme/index";
import { RolesCheckedService, IRoles } from "../../shared/index";

@Component({
    selector: "forumSubsection-list",
    templateUrl: "./forumSubsection-list.component.html"
})
export class ForumSubsectionListComponent implements OnInit, OnDestroy {
    item: ForumSubsection;
    items: ForumTheme[];
    roles: IRoles;
    private sub: Subscription;
    private sub2: Subscription;
    page: number = 1;
    itemsPerPage = 15;
    totalItems: number;

    constructor(private service: ForumSubsectionService,
        private rolesChecked: RolesCheckedService,
        private route: ActivatedRoute, private location: Location) {
    }

    ngOnInit() {
        this.roles = this.rolesChecked.checkRoles();
        this.sub2 = this.route.queryParams.subscribe(params => {
            if (params["page"]) {
                this.page = +params["page"];
            }
        });
        this.sub = this.route.params.subscribe(params => {
            let id = +params["id"];
                   this.update(id);
        });
    };

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.sub2.unsubscribe();
    }

    pageChanged(event: any): void {
        this.page = event;
        this.update(this.item.id);
        let newUrl = `forum/${this.item.id}?page=${this.page}`;

        this.location.replaceState(newUrl);
    };

    update(id: number) {
        this.service.getSingleWithThemes(id, this.page)
            .subscribe(data => {
                this.item = data;
                this.itemsPerPage = data.themes.itemPerPage;
                this.items = data.themes.list;
                this.totalItems = data.themes.totalItems;
            },
            error => console.log(error),
            () => { });
    }
}