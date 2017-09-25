﻿import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { MatchPerson } from "./matchPerson.model";
import { Pageable, HttpWrapper } from "../shared/index";
import { MatchPersonType } from "./matchPersonType.model";

@Injectable()
export class MatchPersonService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = "matchPerson/";
    }
    /*
        public getAll(page: number): Observable<Pageable<MatchEvent>> {
            return this.http.get<Pageable<MatchEvent>>(this.actionUrl + "list?page=" + page);
        };
    
        public getSingle(id: number): Observable<MatchEvent> {
            return this.http.get<MatchEvent>(this.actionUrl + id);
        };*/

    public getForMatch(matchId: number): Observable<MatchPerson[]> {
        return this.http.get<MatchPerson[]>(`${this.actionUrl}getForMatch/${matchId}`);
    };

    public create(item: MatchPerson): Observable<MatchPerson> {
        return this.http.post<MatchPerson>(this.actionUrl, JSON.stringify(item));
    };

    public update( itemToUpdate: MatchPerson): Observable<MatchPerson> {
        return this.http.put<MatchPerson>(this.actionUrl, JSON.stringify(itemToUpdate));
    };

    public getTypes(): Observable<MatchPersonType[]> {
        return this.http.get<MatchPersonType[]>(this.actionUrl + "getTypes/");
    };
    /*
    public delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(this.actionUrl + id);
    };*/
}