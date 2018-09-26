import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { UserFilters, User, UserConfig } from "../model";
import { UsersOnline } from "@app/+common-models";
import { USERS_ROUTE } from "@app/+constants";
import { BaseRestService } from "@app/+infrastructure";

@Injectable()
export class UserService extends BaseRestService<User, UserFilters> {
    private actionUrl: string = USERS_ROUTE + "/";

    constructor(public http: HttpWrapper) {
        super(http, USERS_ROUTE + "/");
    }

    public updateRoleGroup(id: number, roleGroupId: number): Observable<boolean> {
        return this.http.put<boolean>(`${this.actionUrl}updateRoleGroup/${id}/${roleGroupId}`, "");
    };

    public ban(id: number, banDaysCount: number): Observable<boolean> {
        return this.http.put<boolean>(`${this.actionUrl}ban/${id}/${banDaysCount}`, "");
    };

    public unban(id: number): Observable<boolean> {
        return this.http.put<boolean>(`${this.actionUrl}unban/${id}`, "");
    };

    public resetAvatar(id: number): Observable<Object> {
        return this.http.put<Object>(`${this.actionUrl}avatar/${id}/reset`, "");
    };

    public updateAvatar(file: File): Observable<Object> {
        const formData: FormData = new FormData();
        formData.append("uploadFile", file, file.name);
        return this.http.post<Object>(`${this.actionUrl}avatar/`, formData, true);
    };

    public getConfig(): Observable<UserConfig> {
        return this.http.get<UserConfig>(`${this.actionUrl}config`);
    };

    public getBirthdays(): Observable<User[]> {
        return this.http.get<User[]>(`${this.actionUrl}birthdays`);
    };

    public getOnlineCount(): Observable<UsersOnline> {
        return this.http.get<UsersOnline>(`${this.actionUrl}online`);
    };

    public updateConfig (itemToUpdate: UserConfig): Observable<UserConfig> {
        return this.http.put<UserConfig>(`${this.actionUrl}config`, JSON.stringify(itemToUpdate));
    };
}