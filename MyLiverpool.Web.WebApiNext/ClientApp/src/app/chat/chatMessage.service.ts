import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { ChatMessage } from "@app/+common-models";
import { CHAT_MESSAGES_ROUTE } from "@app/+constants";
import { BaseRestService } from "../+infrastructure/base-rest.service";
import { ChatFilters } from "./model/chat-filters.model";

@Injectable()
export class ChatMessageService extends BaseRestService<ChatMessage, ChatFilters> {
    private actionUrl: string = CHAT_MESSAGES_ROUTE + "/";

    constructor(public http: HttpWrapper) {
        super(http, CHAT_MESSAGES_ROUTE + "/");
    }

    public getLatest(lastId: number, typeId: number): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(this.actionUrl + `list/`+ lastId + "/" + typeId);
    };
}