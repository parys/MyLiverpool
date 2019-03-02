import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { TransferState, makeStateKey } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { AdminService } from "../admin.service";
import { HelperType } from "@app/home/helperType.enum";
import { RolesCheckedService } from "@app/+auth";

const CUP_TABLE_KEY = makeStateKey<string>("cup-table");

@Component({
    selector: "cup-table",
    templateUrl: "./cupTable.component.html",
    styleUrls: ["./cupTable.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CupTableComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public cupTable: string;

    constructor(private service: AdminService,
        private cd: ChangeDetectorRef,
        private transferState: TransferState,
        public roles: RolesCheckedService) {
    }

    public ngOnInit(): void {
        const savedData = this.transferState.get(CUP_TABLE_KEY, null);
        if (savedData) {
            this.parse(savedData);
        } else {
            this.sub = this.service
                .getValue(HelperType.CupTable)
                .subscribe(data => {
                        this.parse(data);
                    this.transferState.set(CUP_TABLE_KEY, data);
                },
                    error => console.log(error));
        }
    }

    public ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
    }

    private parse(data: string): void {
        this.cupTable = data;
        this.cd.markForCheck();
    }
}