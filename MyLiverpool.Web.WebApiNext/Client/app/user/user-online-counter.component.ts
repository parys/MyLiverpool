import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { UserService } from "./user.service";
import { IUserOnline } from "./user-online.model";
import { Configuration } from "../app.constants";

@Component({
    selector: "user-online-counter",
    templateUrl: "./user-online-counter.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserOnlineCounterComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public allCount: number = 0;
    public guestCount: number = 0;
    public users: IUserOnline[] = new Array();

    constructor(private userService: UserService,
        private cd: ChangeDetectorRef,
        private config: Configuration) { }

    public ngOnInit(): void {
        this.updateCount();
        this.scheduleUpdateCount();
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
        if(this.sub2) { this.sub2.unsubscribe(); }
    }

    private scheduleUpdateCount() {
        this.sub2 = Observable.interval(this.config.updateUserOnline)
            .map(x => this.updateCount())
            .subscribe();
    }

    private updateCount() {
        this.sub = this.userService.getOnlineCount()
            .subscribe(data => {
                    this.allCount = data.allCount;
                    this.guestCount = data.guestCount;
                    this.users = data.users;
                },
                error => console.log(error),() => {
                    this.cd.markForCheck();
                });
    }
}