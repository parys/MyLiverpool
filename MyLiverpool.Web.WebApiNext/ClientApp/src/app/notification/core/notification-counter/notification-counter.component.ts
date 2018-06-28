﻿import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { NotificationService } from "../notification.service";
import { Notification } from "../../model";
import { RolesCheckedService } from "@app/shared";
import { SignalRService } from "@app/shared";

@Component({
    selector: "notification-counter",
    templateUrl: "./notification-counter.component.html"
})
export class NotificationCounterComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private action: string = "Перейти";
    public count: number = 0;

    constructor(private service: NotificationService,
        public roles: RolesCheckedService,
        private signalR: SignalRService,
        private router: Router,
        private snackBar: MatSnackBar) { }

    public ngOnInit(): void {
        this.updateCount();

        this.signalR.readNotify.subscribe(data => this.count -=data);
        this.signalR.newNotify.subscribe((data : Notification) => {
            this.count++;
            this.snackBar.open("Вам пришло уведомление", this.action)
                .onAction()
                .subscribe(_ => {
                    this.service.read(([data.id])).subscribe(_ =>
                        this.router.navigate([`/${data.typeName}/${data.entityId}`], { fragment: data.commentId ? `com${data.commentId}` : "" }));
                });
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
                    this.snackBar.open("У вас есть новые уведомления", this.action)
                        .onAction()
                        .subscribe(_ => this.router.navigate(["/notifications"]));
                }
                },
                e => console.log(e));
    }
}