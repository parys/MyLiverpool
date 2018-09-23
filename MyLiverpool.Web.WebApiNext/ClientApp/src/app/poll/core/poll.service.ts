import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { Poll } from "../models";
import { POLLS_ROUTE } from "@app/+constants";

@Injectable()
export class PollService {
    private actionUrl: string = POLLS_ROUTE + "/";

    constructor(private http: HttpWrapper) {
    }

    public getAll(): Observable<Poll[]> {
        return this.http.get<Poll[]>(this.actionUrl);
    };

    public getSingle(id: number): Observable<Poll> {
        return this.http.get<Poll>(this.actionUrl + id);
    };

    public create(item: Poll): Observable<Poll> {
        return this.http.post<Poll>(this.actionUrl, JSON.stringify(item));
    };

    public update(id: number, itemToUpdate: Poll): Observable<Poll> {
        return this.http.put<Poll>(this.actionUrl + id, JSON.stringify(itemToUpdate));
    };

    public delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(this.actionUrl + id);
    };

    public getUnreadCount(): Observable<string> {
        return this.http.getString(this.actionUrl + "unreadCount/");
    };
}