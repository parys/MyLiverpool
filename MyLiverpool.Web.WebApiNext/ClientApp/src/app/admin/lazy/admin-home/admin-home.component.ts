import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs";
import { RolesCheckedService } from "@app/+auth";

@Component({
    selector: "admin-home",
    templateUrl: "./admin-home.component.html",
    styleUrls: ["./admin-home.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHomeComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public cupTable: string;

    constructor(private cd: ChangeDetectorRef,
        public roles: RolesCheckedService) {
    }

    public ngOnInit(): void {}

    public ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
    }
}