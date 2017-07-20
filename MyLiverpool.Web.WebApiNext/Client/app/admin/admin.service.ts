import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper } from "../shared/index";

@Injectable()
export class AdminService {
    private actionUrl: string = "admin/";
    private actionHelperUrl: string = "helper/";

    constructor(private http: HttpWrapper) {
    }

    public updateEplTable = (): Observable<string> => {
        return this.http.get(this.actionUrl + "updateTable/").map((res: Response) => res.text());
    };

    public getValue = (id: number): Observable<string> => {
        return this.http.get(`${this.actionHelperUrl}value/${id}`).map((res: Response) => res.text());
    };

    public updateValue = (id: number, value: string): Observable<boolean> => {
        return this.http.put(`${this.actionHelperUrl}value/${id}`, JSON.stringify(value)).map((res: Response) => res.json());
    };
}