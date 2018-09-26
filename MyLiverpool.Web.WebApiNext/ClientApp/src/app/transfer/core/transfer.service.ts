import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { Transfer, TransferFilters } from "@app/transfer/model";
import { TRANSFERS_ROUTE } from "@app/+constants";
import { BaseRestService } from "@app/+infrastructure";

@Injectable()
export class TransferService extends BaseRestService<Transfer, TransferFilters> {
    private actionUrl: string = TRANSFERS_ROUTE + "/";

    constructor(public http: HttpWrapper) {
        super(http, TRANSFERS_ROUTE + "/");
    }
    
    public getCurrentAll(): Observable<Transfer[]> {
        return this.http.get<Transfer[]>(this.actionUrl + `current`);   
    };
}