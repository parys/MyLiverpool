import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RoleGroup } from "../model";
import { HttpWrapper } from "@app/+httpWrapper";
import { ROLE_GROUPS_ROUTE } from "@app/+constants";

@Injectable()
export class RoleGroupService {
    private actionUrl: string = ROLE_GROUPS_ROUTE + "/";

    constructor(private http: HttpWrapper) {
    }

    public getAllWithRoles(): Observable<RoleGroup[]> {
        return this.http.get<RoleGroup[]> (this.actionUrl + "listWithRoles/");
    };

    public getAll(): Observable<RoleGroup[]> {
        return this.http.get<RoleGroup[]> (this.actionUrl);
    };
}