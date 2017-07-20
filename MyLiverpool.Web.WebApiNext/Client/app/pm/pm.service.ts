import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper } from "../shared/httpWrapper";
import { Pm } from "./index";

@Injectable()
export class PmService {
    private actionUrl: string = "pm/";

    constructor(private http: HttpWrapper) {
    }

    public getAll = (): Observable<Pm[]> => {
        return this.http.get(this.actionUrl ).map((res: Response) => res.json());
    };

    public getSingle = (id: number): Observable<Pm> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };

    public create = (item: Pm): Observable<Pm> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((res: Response) => res.json());
    };

    public update = (id: number, itemToUpdate: Pm): Observable<Pm> => {
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };

    public delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((res: Response) => res.json());
    };

    public getUnreadCount = (): Observable<number> => {
        return this.http.get(this.actionUrl + "unreadCount/").map((res: Response) => res.json());
    };
}