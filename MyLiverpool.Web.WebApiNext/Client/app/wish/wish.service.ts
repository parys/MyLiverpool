import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper } from "../shared/httpWrapper";
import { Wish } from "./wish.model";
import { WishType } from "./wishType.model";
import { WishState } from "./wishState.model";
import { Pageable } from "../shared/pageable.model";

@Injectable()
export class WishService {
    private actionUrl: string = "wish/";

    constructor(private http: HttpWrapper) {
    }

    public getAll = (page: number): Observable<Pageable<Wish>> => {
        return this.http.get(`${this.actionUrl}list?page=${page}`).map((res: Response) => res.json());
    };

    public getSingle = (id: number): Observable<Wish> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };

    public create = (item: Wish): Observable<Wish> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((res: Response) => res.json());
    };

    public update = (id: number, itemToUpdate: Wish): Observable<Wish> => {
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };

    public delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((res: Response) => res.json());
    };

    public getTypes = (): Observable<WishType[]> => {
        return this.http.get(this.actionUrl + "types/").map((res: Response) => res.json());
    };

    public getStates = (): Observable<WishState[]> => {
        return this.http.get(this.actionUrl + "states/").map((res: Response) => res.json());
    };
}