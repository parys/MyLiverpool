import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper } from "../shared/index";
import { ChatMessage } from "./chatMessage.model";

@Injectable()
export class ChatMessageService {
    private actionUrl: string = "chatMessage/";

    constructor(private http: HttpWrapper) {
    }

    public getAll = (lastId: number, typeId: number): Observable<ChatMessage[]> => {
        return this.http.get(this.actionUrl + `list/`+ lastId + "/" + typeId).map((res: Response) => res.json());
    };

    public getSingle = (id: number): Observable<ChatMessage> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };

    public create = (item: ChatMessage): Observable<ChatMessage> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((res: Response) => res.json());
    };

    public update = (id: number, itemToUpdate: ChatMessage): Observable<ChatMessage> => {
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };

    public delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((res: Response) => res.json());
    };
}