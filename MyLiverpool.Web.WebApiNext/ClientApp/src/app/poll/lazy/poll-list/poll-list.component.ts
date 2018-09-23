import { Component, OnInit } from "@angular/core";   
import { ActivatedRoute, Router } from "@angular/router";
import { Poll } from "../../models";
import { RolesCheckedService } from "@app/+auth";
import { PollService } from "../../core/poll.service";

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
           .getAll()
            .subscribe(data => this.items = data,
                e => console.log(e));
    }
    
    public delete(index: number): void {
        this.service.delete(this.items[index].id).subscribe(data => {
                if (data) {
                    this.items.splice(index, 1);
                }
            },
            e => console.log(e));
    }
}