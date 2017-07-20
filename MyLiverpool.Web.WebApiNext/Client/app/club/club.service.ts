import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper, Pageable } from "../shared/index";
import { Club } from "./club.model";

@Injectable()
export class ClubService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = "club/";
    }

    getAll = (page: number): Observable<Pageable<Club>> => {
        return this.http.get(this.actionUrl + `list/${page}`).map((res: Response) => res.json());
    };

    getSingle = (id: number): Observable<Club> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };

    create = (item: Club): Observable<Club> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((res: Response) => res.json());
    };

    update = (id: number, itemToUpdate: Club): Observable<Club> => {
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };

    delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((res: Response) => res.json());
    };

    getByName = (typed: string): Observable<Club[]> => {
        return this.http.get(`${this.actionUrl}getClubsByName/${typed}`).map((res: Response) => res.json());
    };

    uploadLogo = (file: File, fileName: string): Observable<string> => {
        let formData: FormData = new FormData();
        formData.append("uploadFile", file, file.name);
        return this.http.post(`${this.actionUrl}logo/${fileName}`, formData, true).map((response: Response) => response.text());
    };
}