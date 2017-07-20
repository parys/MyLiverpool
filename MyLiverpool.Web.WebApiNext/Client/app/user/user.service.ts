import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper } from "../shared/httpWrapper";
import { UserFilters } from "./userFilters.model";
import { User } from "./user.model";
import { UsersOnline } from "./user-online.model";
import { UserConfig } from "./user-config.model";
import { Pageable } from "../shared/pageable.model";

@Injectable()
export class UserService {
    private actionUrl: string = "user/";

    constructor(private http: HttpWrapper) {
    }

    public getAll = (filters: UserFilters): Observable<Pageable<User>> => {
        return this.http.get(this.actionUrl + "list/" + encodeURIComponent(JSON.stringify(filters)))
            .map((response: Response) => response.json());
    };

    public getSingle = (id: number): Observable<User> => {
        return this.http.get(this.actionUrl + id).map((response: Response) => response.json());
    };

    public update = (itemToUpdate: User): Observable<User> => {
        return this.http
            .put(this.actionUrl, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };

    public updateRoleGroup = (id: number, roleGroupId: number): Observable<boolean> => {
        return this.http.put(`${this.actionUrl}updateRoleGroup/${id}/${roleGroupId}`, "").map((response: Response) => response.json());
    };

    public ban = (id: number, banDaysCount: number): Observable<boolean> => {
        return this.http.put(`${this.actionUrl}ban/${id}/${banDaysCount}`, "").map((response: Response) => response.json());
    };

    public unban = (id: number): Observable<boolean> => {
        return this.http.put(`${this.actionUrl}unban/${id}`, "").map((response: Response) => response.json());
    };

    public resetAvatar = (id: number): Observable<string> => {
        return this.http.put(`${this.actionUrl}avatar/${id}/reset`, "").map((response: Response) => response.text());
    };

    public updateAvatar = (file: File): Observable<string> => {
        let formData: FormData = new FormData();
        formData.append("uploadFile", file, file.name);
        return this.http.post(`${this.actionUrl}avatar/`, formData, true).map((response: Response) => response.text());
    };

    public getConfig = (): Observable<UserConfig> => {
        return this.http.get(`${this.actionUrl}config`).map((response: Response) => response.json());
    };

    public getBirthdays = (): Observable<User[]> => {
        return this.http.get(`${this.actionUrl}birthdays`).map((response: Response) => response.json());
    };

    public getOnlineCount = (): Observable<UsersOnline> => {
        return this.http.get(`${this.actionUrl}online`).map((response: Response) => response.json());
    };

    public updateConfig = (itemToUpdate: UserConfig): Observable<UserConfig> => {
        return this.http
            .put(`${this.actionUrl}config`, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };
}