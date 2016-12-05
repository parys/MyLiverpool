﻿import { Injectable } from "@angular/core"; 
import { IRoles } from "../shared/index";
import { LocalStorageService } from "./localStorage.service";

@Injectable()
export class RolesCheckedService {

    checkedRoles: IRoles = {
        isLogined: false,
        isEditor: false,
        isNewsmaker: false,
        isModerator: false,
        isMainModerator: false,
        isAdminAssistant: false,
        isSelf: (userId : number) => this.isSelf(userId)
    };
    private roles: string[];         

    constructor(
        private localStorage: LocalStorageService) {
            this.checkRoles();
    }

    checkRoles(): void {
        this.roles = this.localStorage.getRoles();
        if (!this.roles) {
            return;
        };
        this.checkedRoles.isLogined = true;
        this.checkEditor();
        this.checkNewsmaker();
        this.checkModerator();
        this.checkMainModerator();
        this.checkAdminAssistant();
    }

    private checkEditor():void {
        if (this.checkRole("NewsFull")) {
            this.checkedRoles.isEditor = true;
        }
    }

    private checkNewsmaker():void {
        if (this.checkRole("NewsStart")) {
            this.checkedRoles.isNewsmaker = true;
        }
    }

    private checkModerator():void {
        if (this.checkRole("UserStart")) {
            this.checkedRoles.isModerator = true;
        }
    }

    private checkMainModerator():void {
        if (this.checkRole("UserFull")) {
            this.checkedRoles.isMainModerator = true;
        }
    }

    private checkAdminAssistant():void {
        if (this.checkRole("AdminStart")) {
            this.checkedRoles.isAdminAssistant = true;
        }
    }

    private checkRole(role: string): boolean {
        if (this.roles.find(x => x.toLowerCase() === role.toLowerCase())) {
            return true;
        }
        return false;
    }

    isSelf(authorId: number): boolean {
        let userId = this.localStorage.getUserId();
        return (userId === authorId);        
    }
}