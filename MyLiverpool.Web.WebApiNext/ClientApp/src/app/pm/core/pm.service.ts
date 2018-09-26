import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { Pm } from "../model";
import { User } from "@app/user";
import { PMS_ROUTE } from "@app/+constants";

@Injectable()
export class PmService {
    private actionUrl: string = PMS_ROUTE + "/";

    constructor(private http: HttpWrapper) {
    }

    public getAll(): Observable<Pm[]> {
        return this.http.get<Pm[]>(this.actionUrl );
    };

    public getSingle(id: number): Observable<Pm> {
        return this.http.get<Pm>(this.actionUrl + id);
    };

    public create(item: Pm): Observable<Pm> {
        return this.http.post<Pm>(this.actionUrl, JSON.stringify(item));
    };

    public update(id: number, itemToUpdate: Pm): Observable<Pm> {
        return this.http.put<Pm>(this.actionUrl + id, JSON.stringify(itemToUpdate));
    };

    public delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(this.actionUrl + id);
    };

    public getUnreadCount(): Observable<string> {
        return this.http.getString(this.actionUrl + "unreadCount/");
    };

    public getListByUserName(typed: string): Observable<User[]> { //bug temp workaround
        return this.http.get<User[]>(`user/getUserNames?typed=${typed}`);
    };

}