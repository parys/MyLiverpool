import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { MaterialCommentService } from "./materialComment.service";
import { MaterialComment } from "./materialComment.model";
import { Configuration } from "../app.constants";

@Component({
    selector: "<last-comments>",
    templateUrl: "./last-comments.component.html"
})
export class LastCommentsComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public items: MaterialComment[];

    constructor(private service: MaterialCommentService,
        private route: ActivatedRoute,
        private config: Configuration) {
    }

    public ngOnInit(): void {

        this.update();

        this.scheduleUpdateCount();
    }

    public ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
        if (this.sub2) { this.sub2.unsubscribe(); }
    }

    private scheduleUpdateCount() {
        this.sub = Observable.interval(this.config.updateLastComments)
            .map(x => this.update())
            .subscribe();
    }

    public update(): void {
        this.sub2 = this.service
            .getLastList()
            .subscribe(data => this.items = data,
                error => console.log(error));
    }
}