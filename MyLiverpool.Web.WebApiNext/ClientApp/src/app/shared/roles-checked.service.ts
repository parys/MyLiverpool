﻿import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable()
export class RolesCheckedService {
    //public isLogined: boolean = false;
    //public isEditor: boolean =  false;
    //public isNewsmaker: boolean =  false;
    //public isModerator: boolean =  false;
    //public isMainModerator: boolean =  false;
    //public isAdminAssistant: boolean =  false;
    //public isAdmin: boolean =  false;
    //public isAuthor: boolean =  false;
    //public isInformer: boolean =  false;
    //public isMainInformer: boolean =  false;

    private roles: string[];
    private userRoles: UserRoles = new UserRoles();
    public rolesChanged: Subject<UserRoles> = new Subject<UserRoles>();

    constructor(
        private storage: StorageService) {
        this.checkRoles();
    }

    public checkRoles(): void {
        this.roles = this.storage.getRoles();
        this.userRoles.isLogined = false;
        if (!this.roles) {
            return;
        };
        this.userRoles.isLogined = true;
        this.userRoles.isEditor = this.checkRole("NewsFull") || this.checkRole("BlogFull");
        this.userRoles.isNewsmaker = this.checkRole("NewsStart");
        this.userRoles.isModerator = this.checkRole("UserStart");
        this.userRoles.isMainModerator = this.checkRole("UserFull");
        this.userRoles.isAdminAssistant = this.checkRole("AdminStart");
        this.userRoles.isAdmin = this.checkRole("AdminFull");
        this.userRoles.isAuthor = this.checkRole("BlogStart");
        this.userRoles.isInformer = this.checkRole("InfoStart");
        this.userRoles.isMainInformer = this.checkRole("InfoFull");
        this.rolesChanged.next(this.userRoles);
    }

    public isUserInRole(role: string): boolean {
        return this.checkRole(role);
    }

    public isSelf(authorId: number): boolean {
        const userId: number = this.storage.getUserId();
        return (userId === authorId);
    }

    private checkRole(role: string): boolean {
        if (this.roles.find(x => x.toLowerCase() === role.toLowerCase())) {
            return true;
        }
        return false;
    }
}

export class UserRoles {
    public isLogined: boolean = false;
    public isEditor: boolean = false;
    public isNewsmaker: boolean = false;
    public isModerator: boolean = false;
    public isMainModerator: boolean = false;
    public isAdminAssistant: boolean = false;
    public isAdmin: boolean = false;
    public isAuthor: boolean = false;
    public isInformer: boolean = false;
    public isMainInformer: boolean = false;
}