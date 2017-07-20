import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { IRefreshGrantModel } from "./models/refresh-grant-model";
import { IProfileModel } from "./models/profile-model";
import { IAuthStateModel } from "./models/auth-state-model";
import { IAuthTokenModel } from "./models/auth-tokens-model";
import { IRegisterModel } from "./models/register-model";
import { ILoginModel } from "./models/login-model";
import { RolesCheckedService, HttpWrapper, LocalStorageService } from "../shared/index";
//const jwtDecode = require("jwt-decode");

@Injectable()
export class AuthService {
    public roles: string[] = [];
    private id: number;

    private initalState: IAuthStateModel = { profile: null, tokens: null, authReady: false };
    private authReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private state: BehaviorSubject<IAuthStateModel>;
    private refreshSubscription$: Subscription;

    public state$: Observable<IAuthStateModel>;
    public tokens$: Observable<IAuthTokenModel>;
    public profile$: Observable<IProfileModel>;
    public loggedIn$: Observable<boolean>;

    constructor(private http: HttpWrapper,
        private http1: Http,
        private localStorage: LocalStorageService,
        private rolesCheckedService: RolesCheckedService) {

        this.state = new BehaviorSubject<IAuthStateModel>(this.initalState);
        this.state$ = this.state.asObservable();

        this.tokens$ = this.state.filter((state : IAuthStateModel) => state.authReady)
            .map((state: IAuthStateModel) => state.tokens);

        this.profile$ = this.state.filter((state: IAuthStateModel) => state.authReady)
            .map((state: IAuthStateModel) => state.profile);

        this.loggedIn$ = this.tokens$.map(tokens => !!tokens);
    }

    public isUserInRole(role: string): boolean {
        if (this.roles.find(x => x.toLowerCase() === role.toLowerCase())) {
            return true;
        }
        return false;
    }

    public init(): Observable<IAuthTokenModel> {
        return this.startupTokenRefresh()
            .do(() => this.scheduleRefresh());
    }

    public register(data: IRegisterModel): Observable<Response> {
        return this.http1.post("api/v1/account/register", data)
            .catch(res => Observable.throw(res.json()));
    }

    public login(user: ILoginModel): Observable<any> {
        return this.getTokens(user, "password")
            .catch(res => Observable.throw(res.json()))
            .do(res => {
                this.scheduleRefresh();
            });
    }

    public logout(): void {
        this.updateState({ profile: null, tokens: null });
        if (this.refreshSubscription$) {
            this.refreshSubscription$.unsubscribe();
        }
        this.removeToken();
        this.localStorage.removeAuthTokens();
        this.localStorage.removeAllData();
        this.rolesCheckedService.checkRoles();
    }

    public refreshTokens(): Observable<IAuthTokenModel> {
        return this.state.first()
            .map((state: IAuthStateModel) => state.tokens)
            .flatMap((tokens : IAuthTokenModel) => this.getTokens({ refresh_token: tokens.refresh_token }, "refresh_token")
                .catch(error => Observable.throw("Session Expired"))
            );
    }

    private storeToken(tokens: IAuthTokenModel): void {
        localStorage.setItem("auth-tokens", JSON.stringify(tokens));
    }

    private retrieveTokens(): IAuthTokenModel {
        const tokensString = localStorage.getItem("auth-tokens");
        const tokensModel: IAuthTokenModel = tokensString == null ? null : JSON.parse(tokensString);
        return tokensModel;
    }

    private removeToken(): void {
        localStorage.removeItem("auth-tokens");
    }

    private updateState(newState: IAuthStateModel): void {
        const previoudState = this.state.getValue();
        this.state.next(Object.assign({}, previoudState, newState));
    }

    private getTokens(data: IRefreshGrantModel | ILoginModel, grantType: string): Observable<Response> {
        const headers = new Headers({ 'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8;" });
        const options = new RequestOptions({ headers: headers });

        Object.assign(data, { grant_type: grantType, scope: "openid offline_access" });

        const params = new URLSearchParams();
        Object.keys(data)
            .forEach(key => params.append(key, data[key]));
        return this.http1.post("/connect/token", params.toString(), options)
            .do((res: Response) => {
                const tokens: IAuthTokenModel = res.json();
                const now = new Date();
                tokens.expiration_date = new Date(now.getTime() + tokens.expires_in * 1000).getTime().toString();

             //   const profile: IProfileModel = new Object();// jwtDecode(tokens.id_token);

                this.storeToken(tokens);
              //  this.updateState({ authReady: true, tokens, profile });
                this.updateState({ authReady: true, tokens });
                this.getUserId();
    });
    }

    private startupTokenRefresh(): Observable<IAuthTokenModel> {
        return Observable.of(this.retrieveTokens())
            .flatMap((tokens: IAuthTokenModel) => {
                if (!tokens) {
                    this.updateState({ authReady: true });
                    return Observable.throw("No token in Storage");
                }
               // const profile = jwtDecode(tokens.id_token);

             //   this.updateState({ tokens, profile });
                this.updateState({ tokens });

                if (+tokens.expiration_date > new Date().getTime()) {
                    this.updateState({ authReady: true });
                }

                return this.refreshTokens();
            })
            .catch(error => {
                this.logout();
                this.updateState({ authReady: true });
                return Observable.throw(error);
            });
    }

    private scheduleRefresh(): void {
        this.refreshSubscription$ = this.tokens$
            .first()
            // refresh every half the total expiration time
            .flatMap((tokens: IAuthTokenModel) => Observable.interval(tokens.expires_in / 2 * 1000))
            .flatMap(() => this.refreshTokens())
            .subscribe();
    }

    private parseLoginAnswer(item: any): void {
        this.localStorage.setAuthTokens(item);
    }

    private parseRoles(item: any): void {
        this.roles = item._body.split(", ");
        this.localStorage.setRoles(this.roles);
    }

    private getRoles(): void {
        this.http.get("role")//bug make list request form service
            .subscribe(data => this.parseRoles(data),
                error => console.log(error),
                () => this.rolesCheckedService.checkRoles());
    }

    private getUserId(): void {
        this.http.get("user/getId")//bug make list request form service
            .subscribe(data => this.id = +JSON.parse(data.text()),
                error => console.log(error),
                () => {
                    this.localStorage.setUserId(this.id);
                    this.getRoles();
                });
    }
}