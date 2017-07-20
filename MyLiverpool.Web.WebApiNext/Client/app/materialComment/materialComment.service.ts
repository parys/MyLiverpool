import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { MaterialComment } from "./materialComment.model";
import { CommentVote } from "./commentVote.model";
import { MaterialCommentFilter } from "./materialCommentFilter.model";
import { Pageable } from "../shared/pageable.model";
import { HttpWrapper } from "../shared/httpWrapper";

@Injectable()
export class MaterialCommentService {

    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = "materialComment/";
    }

    public getAll = (filters: MaterialCommentFilter): Observable<Pageable<MaterialComment>> => {
        return this.http.get(this.actionUrl + "list/" + encodeURIComponent(JSON.stringify(filters))).map((res:Response) => res.json());
    };

    public getLastList = (): Observable<MaterialComment[]> => {
        return this.http.get(this.actionUrl + "list/last").map((res:Response) => res.json());
    };

    public getAllByMaterial = (page: number, id: number): Observable<Pageable<MaterialComment>> => {
        return this.http.get(`${this.actionUrl}material/${id}/list/${page}`).map((res: Response) => res.json());
    };

    public getSingle = (id: number): Observable<MaterialComment> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };

    public create = (item: MaterialComment): Observable<MaterialComment> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((res: Response) => res.json());
    };

    public update = (id: number, itemToUpdate: MaterialComment): Observable<MaterialComment> => {
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };

    public delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((res: Response) => res.json());
    };

    public verify = (id: number): Observable<boolean> => {
        return this.http.get(this.actionUrl + "verify/" + id).map((res: Response) => res.json());
    };

    public vote = (vote: CommentVote): Observable<boolean> => {
        return this.http
            .put(this.actionUrl + "vote/", JSON.stringify(vote))
            .map((res: Response) => res.json());
    };
}