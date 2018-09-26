import { Injectable, ApplicationRef } from "@angular/core";
import { Subject } from "rxjs";
import { StorageService } from "@app/+storage";
import { RolesEnum } from "./models/roles.enum";

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
    public userRoles: UserRoles = new UserRoles();
    public rolesChanged: Subject<UserRoles> = new Subject<UserRoles>();
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

    constructor(
        private storage: StorageService,
        private cd: ApplicationRef) {
        this.checkRoles();
    }

    public checkRoles(): void {
        this.roles = this.storage.getRoles();
        this.isLogined = false;
        this.userRoles.isLogined = false;
        if (!this.roles) {
            this.rolesChanged.next(null);
            return;
        };
        this.userRoles.isLogined = true;
        this.userRoles.isEditor = this.checkRole(RolesEnum[RolesEnum.NewsFull]) || this.checkRole(RolesEnum[RolesEnum.BlogFull]);
        this.userRoles.isNewsmaker = this.checkRole(RolesEnum[RolesEnum.NewsStart]);
        this.userRoles.isModerator = this.checkRole(RolesEnum[RolesEnum.UserStart]);
        this.userRoles.isMainModerator = this.checkRole(RolesEnum[RolesEnum.UserFull]);
        this.userRoles.isAdminAssistant = this.checkRole(RolesEnum[RolesEnum.AdminStart]);
        this.userRoles.isAdmin = this.checkRole(RolesEnum[RolesEnum.AdminFull]);
        this.userRoles.isAuthor = this.checkRole(RolesEnum[RolesEnum.BlogStart]);
        this.userRoles.isInformer = this.checkRole(RolesEnum[RolesEnum.InfoStart]);
        this.userRoles.isMainInformer = this.checkRole(RolesEnum[RolesEnum.InfoFull]);
        this.isLogined = true;
        this.isEditor = this.checkRole(RolesEnum[RolesEnum.NewsFull]) || this.checkRole(RolesEnum[RolesEnum.BlogFull]);
        this.isNewsmaker = this.checkRole(RolesEnum[RolesEnum.NewsStart]);
        this.isModerator = this.checkRole(RolesEnum[RolesEnum.UserStart]);
        this.isMainModerator = this.checkRole(RolesEnum[RolesEnum.UserFull]);
        this.isAdminAssistant = this.checkRole(RolesEnum[RolesEnum.AdminStart]);
        this.isAdmin = this.checkRole(RolesEnum[RolesEnum.AdminFull]);
        this.isAuthor = this.checkRole(RolesEnum[RolesEnum.BlogStart]);
        this.isInformer = this.checkRole(RolesEnum[RolesEnum.InfoStart]);
        this.isMainInformer = this.checkRole(RolesEnum[RolesEnum.InfoFull]);
        this.rolesChanged.next(this.userRoles);
        this.cd.tick();
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