import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { Pageable } from "@app/shared";
import { HttpWrapper } from "@app/+httpWrapper";
import { BaseRestFilter } from "./base-rest-filter.model";

@Injectable()
export class BaseRestService<T, TF extends BaseRestFilter> {
    constructor(public http: HttpWrapper,
        @Inject("baseActionUrl") public baseActionUrl: string) {
    }

    public getAll(filters: TF): Observable<Pageable<T>> {
        return this.http.get<Pageable<T>>(this.baseActionUrl + `${encodeURIComponent(JSON.stringify(filters))}`);
    };

    public getSingle(id: number): Observable<T> {
        return this.http.get<T>(this.baseActionUrl + id);
    };

    public createOrUpdate(id: number, item: T): Observable<T> {
        const stringify = JSON.stringify(item);
        if (+id > 0) {
            return this.http.put<T>(this.baseActionUrl + id, stringify);
        } else {
            return this.http.post<T>(this.baseActionUrl, stringify);
        }
    };

    public delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(this.baseActionUrl + id);
    };
}