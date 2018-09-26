import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { Season, PersonStatistics, SeasonFilters } from "../model";
import { SEASONS_ROUTE } from "@app/+constants";
import { BaseRestService } from "@app/+infrastructure";

@Injectable()
export class SeasonService extends BaseRestService<Season, SeasonFilters> {
    private actionUrl: string = SEASONS_ROUTE + "/";

    constructor(public http: HttpWrapper) {
        super(http, SEASONS_ROUTE + "/");
    }

    public getAllWithoutFilter(): Observable<Season[]> {
        return this.http.get<Season[]>(`${this.actionUrl}`);
    };
    
    public getSingleWithMatches(seasonId: number): Observable<Season> {
        return this.http.get<Season>(`${this.actionUrl}getWithMatches/${seasonId}`);
    }

    public getStatistics(seasonId: number): Observable<PersonStatistics[]> {
        return this.http.get<PersonStatistics[]>(`${this.actionUrl}${seasonId}/statistics`);
    }

    public setAsCurrent(id: number): Observable<boolean> {
        return this.http.put<boolean>(this.actionUrl + id + "/setAsCurrent", "");
    };
}