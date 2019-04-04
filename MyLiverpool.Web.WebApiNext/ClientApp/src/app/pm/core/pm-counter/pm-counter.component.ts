import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { PmService } from "../pm.service";
import { SignalRService } from "@app/+signalr";
import { CustomTitleService } from "@app/shared";
import { PMS_ROUTE } from "@app/+constants";
import { Pm } from "../../model/pm.model";

@Component({
    selector: "pm-counter",
    templateUrl: "./pm-counter.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})
export class PmCounterComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public count: number = 0;
    private action: string = "Перейти";

    constructor(private pmService: PmService,
        private snackBar: MatSnackBar,
        private signalR: SignalRService,
        private cd: ChangeDetectorRef,
        private titleService: CustomTitleService,
        private router: Router) {
    }

    public ngOnInit(): void {
        this.updateCount();

        this.signalR.readPm.subscribe((data: boolean) => {
                this.count--;
                this.titleService.removeCount(1);
            },
            () => { },
            () => this.cd.detectChanges());
        this.signalR.newPm.subscribe((data: Pm) => {
                this.count++;
                this.titleService.addCount(1);
                this.snackBar.open("Новое сообщение", this.action)
                    .onAction()
                    .subscribe(_ => this.router.navigate([PMS_ROUTE, data.id]));
            },
            () => {},
            () => this.cd.detectChanges());
    }

    public ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    private updateCount() {
        this.sub = this.pmService.getUnreadCount()
            .subscribe((data : string) => {
                    this.count = +data;
                if (+data > 0) {
                    this.titleService.addCount(this.count);
                    this.snackBar
                        .open("Есть новые сообщения", this.action)
                        .onAction()
                        .subscribe(data => this.router.navigate([PMS_ROUTE]));
                }
                },
                () => { },
                () => this.cd.detectChanges());
    }
}