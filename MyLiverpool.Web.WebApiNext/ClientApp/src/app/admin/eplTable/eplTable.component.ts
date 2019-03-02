import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs";
import { AdminService } from "../admin.service";
import { HelperType } from "@app/home/helperType.enum";
import { RolesCheckedService } from "@app/+auth";

@Component({
    selector: "epl-table",
    templateUrl: "./eplTable.component.html",
    styleUrls: ["./eplTable.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EplTableComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public eplTable: string;
    public opened: boolean = false;

    constructor(private service: AdminService,
        private cd: ChangeDetectorRef,
        public roles: RolesCheckedService) {
    }

    public ngOnInit(): void {
        this.sub = this.service
            .getValue(HelperType.EplTable)
            .subscribe(data => this.eplTable = data,
                error => console.log(error),
                () => {
                    this.cd.markForCheck();
                });
    }

    public ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
        if (this.sub2) this.sub2.unsubscribe();
    }

    public updateEplTable(): void {
        this.sub2 = this.service
            .updateEplTable()
            .subscribe((data: string) => {
                    this.eplTable = data;
                },
                error => console.log(error),
                () => {
                    this.cd.markForCheck();
                });
    }
}