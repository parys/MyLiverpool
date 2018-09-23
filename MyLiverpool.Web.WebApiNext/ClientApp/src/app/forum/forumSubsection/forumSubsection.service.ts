import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { ForumSubsection } from "./forumSubsection.model";
import { FORUM_SUBSECTIONS_ROUTE } from "@app/+constants";

@Injectable()
export class ForumSubsectionService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = FORUM_SUBSECTIONS_ROUTE + "/";
    }

    public getAll(): Observable<ForumSubsection[]> {
        return this.http.get<ForumSubsection[]>(this.actionUrl);
    };

    public getSingle(id: number): Observable<ForumSubsection> {
        return this.http.get<ForumSubsection>(this.actionUrl + id);
    };

    public getSingleWithThemes(id: number, page: number): Observable<ForumSubsection> {
        return this.http.get<ForumSubsection>(`${this.actionUrl}${id}/${page}`);
    };

    public create(item: ForumSubsection): Observable<ForumSubsection> {
        return this.http.post<ForumSubsection>(this.actionUrl, JSON.stringify(item));
    };

    public update = (id: number, itemToUpdate: ForumSubsection): Observable<ForumSubsection> => {
        return this.http.put<ForumSubsection>(this.actionUrl + id, JSON.stringify(itemToUpdate));
    };
}