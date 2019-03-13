import { Component, OnInit } from "@angular/core";   
import { ActivatedRoute, Router } from "@angular/router";
import { Poll, PollFilters } from "../../models";
import { RolesCheckedService } from "@app/+auth";
import { PollService } from "../../core/poll.service";
import { Pageable } from "@app/shared";

@Component({
    selector: "poll-list",
    templateUrl: "./poll-list.component.html"
})
export class PollListComponent implements OnInit {
    public items: Poll[];

    constructor(private service: PollService,
        public roles: RolesCheckedService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.service
           .getAll(new PollFilters())
            .subscribe((data: Pageable<Poll>) => this.items = data.list,
                e => console.log(e));
    }
    
    public delete(index: number): void {
        this.service.delete(this.items[index].id)
            .subscribe((data: boolean) => {
                if (data) {
                    this.items.splice(index, 1);
                }
            },
            () => {});
    }
}