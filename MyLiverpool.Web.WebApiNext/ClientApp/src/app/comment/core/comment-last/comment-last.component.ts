import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { TransferState, makeStateKey } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { CommentService } from "../comment.service";
import { Comment } from "@app/+common-models";
import { SignalRService } from "@app/+signalr";

const COMMENT_LAST_KEY = makeStateKey<Comment[]>("comments-last");

@Component({
    selector: "<comment-last>",
    templateUrl: "./comment-last.component.html",
    styleUrls: ["./comment-last.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentLastComponent implements OnInit, OnDestroy {
    private sub2: Subscription;
    public items: Comment[];

    constructor(private service: CommentService,
        private cd: ChangeDetectorRef,
        private transferState: TransferState,
        private signalRService: SignalRService) {
    }

    public ngOnInit(): void {
        const savedData = this.transferState.get(COMMENT_LAST_KEY, null);
        if (savedData) {
            this.items = savedData;
            this.cd.markForCheck();
        } else {
            this.sub2 = this.service
                .getLastList()
                .subscribe(data => {
                    this.items = data;
                    this.transferState.set(COMMENT_LAST_KEY, data);
                    },
                e => console.log(e),
                    () => this.cd.markForCheck());
        }

        this.signalRService.lastCommentsSubject.subscribe((data: Comment) => {
            const index = this.items.findIndex(x => x.id === data.id);
            if (index !== -1) {
                this.items[index] = data;
            } else {
                this.items.unshift(data);
                this.items.pop();
            }
            this.cd.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        if (this.sub2) { this.sub2.unsubscribe(); }
    }
}