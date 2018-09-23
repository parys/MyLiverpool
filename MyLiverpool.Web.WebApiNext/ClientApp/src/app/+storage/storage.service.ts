import { Injectable, Inject } from "@angular/core";
import { LocalStorage } from "./local-storage";
import { IAuthTokenModel } from "@app/+auth";
import { USER_ID } from "../+constants/help.constants";

@Injectable()
export class StorageService {
    constructor(
        @Inject(LocalStorage) private localStorage: any) {
    }

    public retrieveTokens(): IAuthTokenModel {
        const tokensString = this.get("auth-tokens");
        if (tokensString) {
            const tokens: IAuthTokenModel = JSON.parse(tokensString);
            if (tokens) {
                tokens.refresh_token = this.getRefreshToken();
                return tokens;
            }
        }
        return null;
    }

    public getAccessToken(): string {
        const tokens = this.retrieveTokens();
        if (tokens) {
            return tokens.access_token;
        }
        return null;
    }

    public getRoles(): string[] {
        return this.getObject("roles");
    }

    public getUserId(): number {
        return +this.get(USER_ID);
    }
    
    public removeAuthTokens(): void {
        this.remove("roles");
        this.remove(USER_ID);
        this.remove("auth-tokens");
        this.remove("refresh-token");
    }

    public setAuthTokens(item: any): boolean {
        this.set("auth-tokens", JSON.stringify(item));
        return true;
    }

    public setRefreshToken(token: string): void {
        this.set("refresh-token", token);
    }

    public getRefreshToken(): string {
        return this.get("refresh-token");
    }

    public setRoles(roles: string[]): void {
        if (!this.localStorage) return;
        this.setObject("roles", roles);
    }

    public setUserId(id: number): void {
        if (!this.localStorage) return;
        this.setObject(USER_ID, id);
    }

    public tryAddViewForMaterial(id: number): boolean {
        if (!this.localStorage) return false;
        if (!this.get(`material${id}`)) {
            this.set(`material${id}`, "1");
            return true;
        }
        return false;
    }
    
    private setExpiredDate(seconds: number): string {
        let date = new Date();
        date.setSeconds(date.getSeconds() + seconds);
        return date.toUTCString();
    };

    private set(key: string, value: string): void {
        if (!this.localStorage) return;
        localStorage[key] = value;
    }

    private get(key: string): string {
        if (!this.localStorage) return "";
        return localStorage[key] || "";
    }

    private setObject(key: string, value: any): void {
        if (!this.localStorage) return;
        localStorage[key] = JSON.stringify(value);
    }

    private getObject(key: string): any {
        if (!this.localStorage) return null;
        if (localStorage[key]) {
            return JSON.parse(localStorage[key]);
        }
        return null;
    }

    private remove(key: string): void {
        if (!this.localStorage) return;
        this.localStorage.removeItem(key);
    }
}