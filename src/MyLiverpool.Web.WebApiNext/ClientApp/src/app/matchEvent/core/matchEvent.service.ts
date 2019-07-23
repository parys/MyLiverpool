﻿import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MatchEvent, MatchEventType } from "@app/matchEvent/models";
import { HttpWrapper } from "@app/+httpWrapper";
import { MATCH_EVENTS_ROUTE, MATCHES_ROUTE } from "@app/+constants";

@Injectable()
export class MatchEventService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = MATCH_EVENTS_ROUTE + "/";
    }

    public getMatchEvents(matchId: number): Observable<MatchEvent[]> {
        return this.http.get<MatchEvent[]>(`${MATCHES_ROUTE}/${matchId}/events`);
    };

    public create(item: MatchEvent): Observable<MatchEvent> {
        return this.http.post<MatchEvent>(this.actionUrl, JSON.stringify(item));
    };

    public update(id: number, itemToUpdate: MatchEvent): Observable<MatchEvent> {
        return this.http.put<MatchEvent>(this.actionUrl + id, JSON.stringify(itemToUpdate));
    };

    public getTypes(): Observable<MatchEventType[]> {
        return this.http.get<MatchEventType[]>(this.actionUrl + "getTypes/");
    };
    
    public delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(this.actionUrl + id);
    };
}