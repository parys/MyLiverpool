import { Injectable } from "@angular/core";
import { IRoles } from "./roles.interface";
import { LocalStorageService } from "./localStorage.service";

@Injectable()
export class RolesCheckedService {
    private checkedRoles: IRoles = {
        isLogined: false,
        isEditor: false,
        isNewsmaker: false,
        isModerator: false,
        isMainModerator: false,
        isAdminAssistant: false,
        isAdmin: false,
        isAuthor: false,
        isInformer: false,
        isMainInformer: false,
        isSelf: (userId: number): boolean => this.isSelf(userId)
    };
    private roles: string[];

    constructor(
        private localStorage: LocalStorageService) {
        this.checkRoles();
    }

    public checkRoles(): IRoles {
        this.roles = this.localStorage.getRoles();
        this.checkedRoles.isLogined = false;
        if (!this.roles) {
            return this.checkedRoles;
        };
        this.checkedRoles.isLogined = true;
        this.checkEditor();
        this.checkNewsmaker();
        this.checkModerator();
        this.checkMainModerator();
        this.checkAdminAssistant();
        this.checkAdmin();
        this.checkAuthor();
        this.checkInformer();
        this.checkMainInformer();
        return this.checkedRoles;
    }

    public isUserInRole(role: string): boolean {
        return this.checkRole(role);
    }

    private isSelf(authorId: number): boolean {
        const userId: number = this.localStorage.getUserId();
        return (userId === authorId);
    }

    private checkEditor(): void {
        if (this.checkRole("NewsFull") || this.checkRole("BlogFull")) {
            this.checkedRoles.isEditor = true;
        }
    }

    private checkNewsmaker(): void {
        if (this.checkRole("NewsStart")) {
            this.checkedRoles.isNewsmaker = true;
        }
    }

    private checkModerator(): void {
        if (this.checkRole("UserStart")) {
            this.checkedRoles.isModerator = true;
        }
    }

    private checkMainModerator(): void {
        if (this.checkRole("UserFull")) {
            this.checkedRoles.isMainModerator = true;
        }
    }

    private checkAdminAssistant(): void {
        if (this.checkRole("AdminStart")) {
            this.checkedRoles.isAdminAssistant = true;
        }
    }

    private checkAdmin(): void {
        if (this.checkRole("AdminFull")) {
            this.checkedRoles.isAdmin = true;
        }
    }

    private checkAuthor(): void {
        if (this.checkRole("BlogStart")) {
            this.checkedRoles.isAuthor = true;
        }
    }

    private checkInformer(): void {
        if (this.checkRole("InfoStart")) {
            this.checkedRoles.isInformer = true;
        }
    }

    private checkMainInformer(): void {
        if (this.checkRole("InfoFull")) {
            this.checkedRoles.isMainInformer = true;
        }
    }

    private checkRole(role: string): boolean {
        if (this.roles.find(x => x.toLowerCase() === role.toLowerCase())) {
            return true;
        }
        return false;
    }
}