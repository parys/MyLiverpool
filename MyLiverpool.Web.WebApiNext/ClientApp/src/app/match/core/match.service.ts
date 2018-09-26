import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Match, MatchType } from "@app/match/model";
import { HttpWrapper } from "@app/+httpWrapper";
import { MATCHES_ROUTE } from "@app/+constants";
import { BaseRestService } from "@app/+infrastructure";
import { MatchFilters } from "../model";

@Injectable()
export class MatchService extends BaseRestService<Match, MatchFilters> {
    private actionUrl: string = MATCHES_ROUTE + "/";

    constructor(public http: HttpWrapper) {
        super(http, MATCHES_ROUTE + "/");
    }
    
    public getForCalendar(): Observable<Match[]> {
        return this.http.get<Match[]>(this.actionUrl + "getForCalendar");
    };

    public getHeaderMatch(): Observable<Match> {
        return this.http.get<Match>(this.actionUrl + "header");
    };

    public pin(id?: number): Observable<boolean> {
        return this.http.put<boolean>(this.actionUrl + id + "/setAsHeader", "");
    };
    
    public getTypes(): Observable<MatchType[]> {
        return this.http.get<MatchType[]>(this.actionUrl + "getTypes/");
    };
}