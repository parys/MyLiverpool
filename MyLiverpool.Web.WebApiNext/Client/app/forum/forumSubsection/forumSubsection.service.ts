import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper } from "../../shared/index";
import { ForumSubsection } from "./forumSubsection.model";

@Injectable()
export class ForumSubsectionService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = "forumSubsection/";
    }

    getAll = (): Observable<ForumSubsection[]> => {
        return this.http.get(this.actionUrl + "list/").map((res: Response) => res.json());
    };

    getSingle = (id: number): Observable<ForumSubsection> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };

    getSingleWithThemes = (id: number, page: number): Observable<ForumSubsection> => {
        return this.http.get(`${this.actionUrl}${id}/${page}`).map((res: Response) => res.json());
    };

    create = (item: ForumSubsection): Observable<ForumSubsection> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((res: Response) => res.json());
    };

    update = (id: number, itemToUpdate: ForumSubsection): Observable<ForumSubsection> => {
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };
}