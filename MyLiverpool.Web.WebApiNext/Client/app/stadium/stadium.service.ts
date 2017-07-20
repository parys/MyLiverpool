import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper, Pageable } from "../shared/index";
import { Stadium } from "./stadium.model";

@Injectable()
export class StadiumService {
    private actionUrl: string = "stadium/";

    constructor(private http: HttpWrapper) {
    }

    public getAll = (page: number): Observable<Pageable<Stadium>> => {
        return this.http.get(this.actionUrl + `list?page=${page}`).map((res: Response) => res.json());
    };

    public getAllAll = (): Observable<Stadium[]> => {
        return this.http.get(this.actionUrl + `listAll`).map((res: Response) => res.json());
    };

    public getListByName = (typed: string): Observable<Stadium[]> => {
        return this.http.get(this.actionUrl + `getListByName?typed=${typed}`).map((res: Response) => res.json());
    };

    public getSingle = (id: number): Observable<Stadium> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };

    public create = (item: Stadium): Observable<Stadium> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((res: Response) => res.json());
    };

    public update = (id: number, itemToUpdate: Stadium): Observable<Stadium> => {
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };

    public delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((res: Response) => res.json());
    };

    public updatePhoto = (name: string, file: File): Observable<string> => {
        let formData: FormData = new FormData();
        formData.append("uploadFile", file, file.name);
        return this.http.post(`${this.actionUrl}photo/${name}`, formData, true).map((response: Response) => response.text());
    };
}