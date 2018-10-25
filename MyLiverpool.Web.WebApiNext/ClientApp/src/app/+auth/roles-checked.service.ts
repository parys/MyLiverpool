import { Injectable, ApplicationRef } from "@angular/core";
import { Subject } from "rxjs";
import { RolesEnum } from "./models/roles.enum";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Injectable({
    providedIn: 'root'
})
export class RolesCheckedService {

    private roles: string[];
    private userId: number;
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
        public oidcSecurityService: OidcSecurityService,
        private cd: ApplicationRef) {

        if (this.oidcSecurityService.moduleSetup) {
            this.doCallbackLogicIfRequired();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() => {
                this.doCallbackLogicIfRequired();
            });
        }
        
        this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isLogined = isAuthorized;
                this.userRoles.isLogined = isAuthorized;
                if (isAuthorized) {
                    this.oidcSecurityService.getUserData().subscribe(data => {
                        this.roles = data.role;
                        this.userId = +data.sub;
                        this.checkRoles();
                    });
                }
            });
    }

    public checkRoles(): void {
        if (!this.roles || !this.isLogined) {
            this.rolesChanged.next(null);
            return;
        };
        //    this.userRoles.isLogined = true;
        this.userRoles.isEditor = this.checkRole(RolesEnum[RolesEnum.NewsFull]) || this.checkRole(RolesEnum[RolesEnum.BlogFull]);
        this.userRoles.isNewsmaker = this.checkRole(RolesEnum[RolesEnum.NewsStart]);
        this.userRoles.isModerator = this.checkRole(RolesEnum[RolesEnum.UserStart]);
        this.userRoles.isMainModerator = this.checkRole(RolesEnum[RolesEnum.UserFull]);
        this.userRoles.isAdminAssistant = this.checkRole(RolesEnum[RolesEnum.AdminStart]);
        this.userRoles.isAdmin = this.checkRole(RolesEnum[RolesEnum.AdminFull]);
        this.userRoles.isAuthor = this.checkRole(RolesEnum[RolesEnum.BlogStart]);
        this.userRoles.isInformer = this.checkRole(RolesEnum[RolesEnum.InfoStart]);
        this.userRoles.isMainInformer = this.checkRole(RolesEnum[RolesEnum.InfoFull]);
        //       this.isLogined = true;
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
        return (this.userId === authorId);
    }

    public login(): void {
        this.oidcSecurityService.authorize();
    }

    public logout(): void {
        this.oidcSecurityService.logoff();
    }

    private doCallbackLogicIfRequired() {
        if (window.location.hash) {
            this.oidcSecurityService.authorizedCallback();
        }
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