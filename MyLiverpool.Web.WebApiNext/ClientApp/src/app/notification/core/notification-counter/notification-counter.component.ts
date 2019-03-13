import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { NotificationService } from "../notification.service";
import { Notification } from "../../model";
import { RolesCheckedService } from "@app/+auth";
import { SignalRService } from "@app/+signalr";
import { CustomTitleService } from "@app/shared";
import { NOTIFICATIONS_ROUTE } from "@app/+constants";

@Component({
    selector: "notification-counter",
    templateUrl: "./notification-counter.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})
export class NotificationCounterComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private action: string = "Перейти";
    public count: number = 0;

    constructor(private service: NotificationService,
        public roles: RolesCheckedService,
        private signalR: SignalRService,
        private router: Router,
        private titleService: CustomTitleService,
        private cd: ChangeDetectorRef,
        private snackBar: MatSnackBar) { }

    public ngOnInit(): void {
        this.updateCount();

        this.signalR.readNotify.subscribe((data: number) => {
                this.count -= data;
                this.titleService.removeCount(data);
            },
            () => {},
            () => {
                this.cd.markForCheck();
            });
        this.signalR.newNotify.subscribe((data: Notification) => {
                this.count++;
                this.titleService.addCount(1);
                this.snackBar.open("Новое уведомление", this.action)
                    .onAction()
                    .subscribe(_ => {
                        this.service.read(([data.id])).subscribe(_ =>
                            this.router.navigate([`/${data.typeName}/${data.entityId}`],
                                { fragment: data.commentId ? `com${data.commentId}` : "" }));
                    });
        },
            () => {},
            () => {
                this.cd.markForCheck();
            });
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
    }

    private updateCount() {
        this.sub = this.service.getUnreadCount()
            .subscribe(data => {
                    this.count = +data;
                    if (+data > 0) {
                        this.titleService.addCount(this.count);
                        this.snackBar.open("Есть новые уведомления", this.action)
                            .onAction()
                            .subscribe(_ => this.router.navigate([NOTIFICATIONS_ROUTE]));
                    }
                },
                () => {},
                () => {
                    this.cd.markForCheck();
                });
    }
}