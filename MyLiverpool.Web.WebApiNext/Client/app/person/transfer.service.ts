import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper, Pageable } from "../shared/index";
import { Transfer } from "./transfer.model";

@Injectable()
export class TransferService {
    private actionUrl: string = "transfer/";

    constructor(private http: HttpWrapper) {
    }

    public getAll = (page: number): Observable<Pageable<Transfer>> => {
        return this.http.get(this.actionUrl + `list?page=${page}`).map((res: Response) => res.json());
    };

    public getCurrentAll = (): Observable<Transfer[]> => {
        return this.http.get(this.actionUrl + `current`).map((res: Response) => res.json());
    };

    public getSingle = (id: number): Observable<Transfer> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };
    
    public create = (item: Transfer): Observable<Transfer> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((res: Response) => res.json());
    };

    public update = (id: number, itemToUpdate: Transfer): Observable<Transfer> => {
        console.debug(itemToUpdate);
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };

    public delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((res: Response) => res.json());
    };
}