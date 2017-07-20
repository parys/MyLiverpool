import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper } from "../shared/httpWrapper";
import { Season } from "./season.model";

@Injectable()
export class SeasonService {
    private actionUrl: string = "season/";

    constructor(private http: HttpWrapper) {
    }

    public getAll = (): Observable<Season[]> => {
        return this.http.get(`${this.actionUrl}list/`).map((response: Response) => response.json());
    };

    public getSingle = (id: number): Observable<Season> => {
        return this.http.get(`${this.actionUrl}/${id}`).map((response: Response) => response.json());
    };

    public create = (item: Season): Observable<Season> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((response: Response) => response.json());
    };

    public update = (id: number, itemToUpdate: Season): Observable<Season> => {
        return this.http.put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((response: Response) => response.json());
    };

    public delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((response: Response) => response.json());
    };

    public getSingleWithMatches = (seasonId: number) => {
        return this.http.get(`${this.actionUrl}getWithMatches/${seasonId}`)
            .map((response: Response) => response.json());
    }
}