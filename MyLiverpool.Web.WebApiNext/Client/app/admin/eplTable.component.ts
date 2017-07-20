import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { AdminService } from "./admin.service";
import { HelperType } from "./helperType.enum";
import { RolesCheckedService, IRoles } from "../shared/index";

@Component({
    selector: "epl-table",
    templateUrl: "./eplTable.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EplTableComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private sub2: Subscription;
    public roles: IRoles;
    public eplTable: string;
    public opened: boolean = false;

    constructor(private service: AdminService,
        private cd: ChangeDetectorRef,
        private rolesChecked: RolesCheckedService) {
    }

    public ngOnInit(): void {
        this.roles = this.rolesChecked.checkRoles();
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
            .subscribe(data => this.eplTable = data,
            error => console.log(error),
                () => {
                    this.cd.markForCheck();
                });
    }
}