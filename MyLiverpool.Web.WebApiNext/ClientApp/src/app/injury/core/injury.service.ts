import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { Injury, InjuryFilters } from "../model";
import { INJURIES_ROUTE } from "@app/+constants";
import { BaseRestService } from "@app/+infrastructure";

@Injectable()
export class InjuryService extends BaseRestService<Injury, InjuryFilters> {
    private actionUrl: string = INJURIES_ROUTE + "/";

    constructor(public http: HttpWrapper) {
        super(http, INJURIES_ROUTE + "/");
    }

    public getCurrentAll(): Observable<Injury[]> {
        return this.http.get<Injury[]>(this.actionUrl + `current`);
    };
}