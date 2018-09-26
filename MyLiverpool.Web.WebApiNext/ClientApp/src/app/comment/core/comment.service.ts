import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Comment } from "@app/+common-models";
import { CommentVote, CommentFilter } from "../model";
import { Pageable } from "@app/shared";
import { HttpWrapper } from "@app/+httpWrapper";
import { COMMENTS_ROUTE } from "@app/+constants";
import { BaseRestService } from "@app/+infrastructure";

@Injectable()
export class CommentService extends BaseRestService<Comment, CommentFilter> {
    private actionUrl: string = COMMENTS_ROUTE + "/";

    constructor(public http: HttpWrapper) {
        super(http, COMMENTS_ROUTE + "/");
    }
    
    public getLastList(): Observable<Comment[]> {
        return this.http.get<Comment[]>(this.actionUrl + "last");
    };

    public getAllByMaterial(page: number, id: number): Observable<Pageable<Comment>> {
        return this.http.get<Pageable<Comment>>(`${this.actionUrl}material/${id}/list/${page}`);//todo move to material service
    };

    public getAllByMatch(page: number, id: number): Observable<Pageable<Comment>> {
        return this.http.get<Pageable<Comment>>(`${this.actionUrl}match/${id}/list/${page}`);//todo move to match service
    };
    
    public verify(id: number): Observable<boolean> {
        return this.http.get<boolean>(this.actionUrl + "verify/" + id);
    };

    public vote(vote: CommentVote): Observable<boolean> {
        return this.http.put<boolean>(this.actionUrl + "vote/", JSON.stringify(vote));
    };
}