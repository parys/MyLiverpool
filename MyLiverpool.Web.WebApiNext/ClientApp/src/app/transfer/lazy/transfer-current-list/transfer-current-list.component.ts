import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { TransferService } from "@app/transfer/core";
import { Transfer } from "@app/transfer/model";
import { RolesCheckedService } from "@app/+auth";

@Component({
    selector: "transfer-current-list",
    templateUrl: "./transfer-current-list.component.html",
    styleUrls: ["./transfer-current-list.component.scss"]
})
export class TransferCurrentListComponent implements OnInit, OnDestroy {
    private sub2: Subscription;
    public comeIn: Transfer[];
    public comeOut: Transfer[];
    public totalIn: number = 0;
    public totalOut: number = 0;

    constructor(private service: TransferService,
        public roles: RolesCheckedService) {
    }

    public ngOnInit(): void {
        this.update();
    }

    public ngOnDestroy(): void {
        if (this.sub2) { this.sub2.unsubscribe(); }
    }

    public update(): void {
        this.sub2 = this.service
            .getCurrentAll()
            .subscribe((data: Transfer[]) => this.parseList(data));
    }

    private parseList(list: Transfer[]): void {
        this.comeIn = list.filter(x => x.coming);
        this.comeOut = list.filter(x => !x.coming);
        this.comeIn.forEach(elem => this.totalIn += elem.amount);
        this.comeOut.forEach(elem => this.totalOut += elem.amount);
    }
}