import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper } from "../../shared/index";
import { ForumTheme } from "./forumTheme.model";

@Injectable()
export class ForumThemeService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = "forumTheme/";
    }

    getAll = (): Observable<ForumTheme[]> => {
        return this.http.get(this.actionUrl + "list/").map((res: Response) => res.json());
    };

    getSingle = (id: number): Observable<ForumTheme> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };

    getSingleWithMessages = (id: number, page: number): Observable<ForumTheme> => {
        return this.http.get(`${this.actionUrl}${id}/${page}`).map((res: Response) => res.json());
    };

    create = (item: ForumTheme): Observable<ForumTheme> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((res: Response) => res.json());
    };

    update = (id: number, itemToUpdate: ForumTheme): Observable<ForumTheme> => {
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };
}