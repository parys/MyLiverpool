import { HttpClient, HttpHeaders } from "@angular/common/http";
import { filter, map, tap, catchError, flatMap, first } from "rxjs/operators";
import { Injectable, EventEmitter, Output, Injector } from '@angular/core';
import { OidcSecurityService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';

import { IRefreshGrantModel } from "./models/refresh-grant-model";
import { IProfileModel, IAuthStateModel, IAuthTokenModel, IRegisterModel, ILoginModel, IUserProfile } from "./models";
import { HttpWrapper } from "@app/+httpWrapper";
import { StorageService } from "@app/+storage";
import { RolesCheckedService } from "./roles-checked.service";
import { SignalRService } from "@app/+signalr";
//const jwtDecode = require("jwt-decode");

@Injectable({
    providedIn: 'root'
})
export class OidcCustomConfigService {

    @Output() onConfigurationLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    authAddr: any;
    wellKnownEndpoints: any;

    constructor() {

        //this.state = new BehaviorSubject<IAuthStateModel>(this.initalState);
        //this.state$ = this.state.asObservable();

        //this.tokens$ = this.state.pipe(
        //    filter((state: IAuthStateModel) => state.authReady),
        //    map((state: IAuthStateModel) => state.tokens));

        //this.profile$ = this.state.pipe(
        //    filter((state: IAuthStateModel) => state.authReady),
        //    map((state: IAuthStateModel) => state.profile));

        //this.loggedIn$ = this.tokens$.pipe(map(tokens => !!tokens));
    }

    async loadConfig(configUrl: string) {
        try {
            const response = await fetch(configUrl);
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            this.authAddr = await response.json();
            console.log("123a");
            console.log(this.authAddr);
           // await this.loadSSOConfig(this.config.SSOAddress);
            await this.loadSSOConfig(this.authAddr);
        } catch (err) {
            console.error(`ConfigService 'loadConfig' threw an error on calling ${configUrl}`, err);
            this.onConfigurationLoaded.emit(false);
        }
    }

    async loadSSOConfig(stsServer: string) {
        try {
            const response = await fetch(`${stsServer}/.well-known/openid-configuration`);

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            this.wellKnownEndpoints = await response.json();
            this.onConfigurationLoaded.emit(true);
        } catch (err) {
            console.error(`ConfigService 'loadSSOConfig' threw an error on calling ${stsServer}`, err);
            this.onConfigurationLoaded.emit(false);
        }
    }

    setupSSO(oidcSecurityService: OidcSecurityService) {
        const c = new OpenIDImplicitFlowConfiguration();
        c.stsServer = this.authAddr;
        c.redirect_url = window.location.origin;
        c.client_id = "ng";
        c.response_type = 'id_token token';
        c.scope = 'openid profile role';
        c.post_logout_redirect_uri = window.location.origin + '/unauthorized';
        c.forbidden_route = '/forbidden';
        c.unauthorized_route = '/unauthorized';
        c.auto_userinfo = true;
        c.log_console_warning_active = true;
        c.log_console_debug_active = true;
        c.max_id_token_iat_offset_allowed_in_seconds = 10;
        c.start_checksession = false;
        c.silent_renew = false;
        const wn = new AuthWellKnownEndpoints();
        wn.setWellKnownEndpoints(this.wellKnownEndpoints);
        oidcSecurityService.setupModule(c, wn);
    }


    //public isUserInRole(role: string): boolean {
    //    if (this.roles.find(x => x.toLowerCase() === role.toLowerCase())) {
    //        return true;
    //    }
    //    return false;
    //}

    //public init(): Observable<IAuthTokenModel> {
    //    return this.startupTokenRefresh().pipe(
    //        tap(() => this.scheduleRefresh()));
    //}

    //public register(data: IRegisterModel): Observable<any> {
    //    return this.http1.post("api/v1/account/register", data).pipe(
    //        catchError(res => throwError(res.error)));
    //}

    //public login(user: ILoginModel): Observable<any> {
    //    return this.getTokens(user, "password").pipe(
    //        catchError(res => throwError(res.error)),
    //        tap(res => {
    //            this.scheduleRefresh();
    //        }));
    //}

    //public logout(): void {
    //    this.updateState({ profile: null, tokens: null });
        
    //    this.storage.removeAuthTokens();
    //    this.rolesCheckedService.checkRoles();

    //    if (this.refreshSubscription$) {
    //        this.refreshSubscription$.unsubscribe();

    //        console.warn("init hub from logout");
    //        this.signalRservice.initializeHub();
    //    }
    //}

    //public refreshTokens(): Observable<IAuthTokenModel> {
    //    return this.getTokens({ refresh_token: this.storage.getRefreshToken() }, "refresh_token")
    //            .pipe(catchError(error => throwError("Expired")));
    //}

    //private updateState(newState: IAuthStateModel): void {
    //    const previoudState = this.state.getValue();
    //    this.state.next(Object.assign({}, previoudState, newState));
    //}

    //private getTokens(data: IRefreshGrantModel | ILoginModel, grantType: string): Observable<IAuthTokenModel> {
    //    const headers = new HttpHeaders({ 'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8;" });

    //    Object.assign(data, { grant_type: grantType, scope: "openid offline_access" });

    //    const params = new URLSearchParams();
    //    Object.keys(data)
    //        .forEach(key => params.append(key, data[key]));
    //    return this.http1.post<IAuthTokenModel>("/connect/token", params.toString(), { headers: headers }).pipe(
    //        tap((tokens: IAuthTokenModel) => {
                
    //            tokens.expiration_date = new Date(new Date().getTime() + tokens.expires_in * 1000).getTime().toString();

    //            //   const profile: IProfileModel = new Object();// jwtDecode(tokens.id_token);

    //            this.storage.setAuthTokens(tokens);
    //            if (tokens.refresh_token) {
    //                this.storage.setRefreshToken(tokens.refresh_token);
    //            }
    //            //  this.updateState({ authReady: true, tokens, profile });
    //            this.updateState({ authReady: true, tokens });
    //            this.getUserProfile();
    //        }));
    //}

    //private startupTokenRefresh(): Observable<IAuthTokenModel> {
    //    return of(this.storage.retrieveTokens()).pipe(
    //        flatMap((tokens: IAuthTokenModel) => {
    //            if (!tokens) {
    //                this.updateState({ authReady: true });

    //                console.warn("init hub from refresh");
    //                this.signalRservice.initializeHub();
    //                return throwError("No token");
    //            }
    //           // const profile = jwtDecode(tokens.id_token);

    //         //   this.updateState({ tokens, profile });
    //            this.updateState({ tokens });

    //            if (+tokens.expiration_date > new Date().getTime()) {
    //                this.updateState({ authReady: true });
    //            }

    //            return this.refreshTokens();
    //        }),
    //        catchError(e => {
    //            console.warn("logout = ");
    //            console.warn(e);
    //            this.logout();
    //            this.updateState({ authReady: true });
    //            return throwError(e);
    //        }));
    //}

    //private scheduleRefresh(): void {
    //    this.refreshSubscription$ = this.tokens$.pipe(
    //        first(),
    //        // refresh every half the total expiration time
    //        flatMap((tokens: IAuthTokenModel) => interval(tokens.expires_in * 500)),
    //        flatMap(() => this.refreshTokens()))
    //        .subscribe();
    //}
    
    //private getUserProfile(): void {
    //    this.http.get<IUserProfile>("role") //bug make list request form service
    //        .subscribe((data: IUserProfile) => {
    //                this.storage.setUserId(+data.userId);
    //                this.storage.setRoles(data.roles.split(", "));
    //            this.rolesCheckedService.checkRoles();

    //                console.warn("init hub from getUserProfile");
    //                this.signalRservice.initializeHub();//WARNING---------------------------------------------------------
    //            },
    //            e => console.log(e)
    //        );
    //}
}