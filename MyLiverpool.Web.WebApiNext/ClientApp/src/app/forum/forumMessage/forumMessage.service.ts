import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { ForumMessage } from "./forumMessage.model";

@Injectable()
export class ForumMessageService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = "/";
    }

    // getAll = (): Observable<ForumMessage[]> => {
    //    return this.http.get(this.actionUrl + "list/").map(res => res.json());
    // };

    // getSingle = (id: number): Observable<ForumMessage> => {
    //    return this.http.get(this.actionUrl + id).map(res => res.json());
    // };

    // getSingleWithMessages = (id: number, page: number): Observable<ForumMessage> => {
    //    return this.http.get(`${this.actionUrl}${id}/${page}`).map(res => res.json());
    // };

    public create = (item: ForumMessage): Observable<ForumMessage> => {
        return this.http.post<ForumMessage>(this.actionUrl, JSON.stringify(item));
    };

    public update = (id: number, itemToUpdate: ForumMessage): Observable<ForumMessage> => {
        return this.http.put<ForumMessage>(this.actionUrl + id, JSON.stringify(itemToUpdate));
    };

    public delete = (id: number): Observable<boolean> => {
        return this.http.delete<boolean>(`${this.actionUrl}/${id}`);
    };
}