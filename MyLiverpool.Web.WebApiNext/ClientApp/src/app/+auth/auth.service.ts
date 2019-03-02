import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { filter, map, tap, catchError, flatMap, first } from "rxjs/operators";
import { Observable, Subscription, BehaviorSubject, of, interval, throwError } from "rxjs";
import { IRefreshGrantModel } from "./models/refresh-grant-model";
import { IAuthStateModel, IAuthTokenModel, IRegisterModel, ILoginModel } from "./models";
import { HttpWrapper } from "@app/+httpWrapper";
import { StorageService } from "@app/+storage";
import { RolesCheckedService } from "./roles-checked.service";
import { SignalRService } from "@app/+signalr";
import { UriEncoder } from "./uri-encoder";

@Injectable()
export class AuthService {

    private initialState: IAuthStateModel = { tokens: null, authReady: false };
    private state: BehaviorSubject<IAuthStateModel>;
    private refreshSubscription$: Subscription;

    public tokens$: Observable<IAuthTokenModel>;
    public loggedIn$: Observable<boolean>;

    constructor(private http: HttpWrapper,
        private http1: HttpClient,
        private storage: StorageService,
        private signalRService: SignalRService,
        private rolesCheckedService: RolesCheckedService
    ) {

        this.state = new BehaviorSubject<IAuthStateModel>(this.initialState);

        this.tokens$ = this.state.pipe(
            filter((state: IAuthStateModel) => state.authReady),
            map((state: IAuthStateModel) => state.tokens));

        this.loggedIn$ = this.tokens$.pipe(map(tokens => !!tokens));
    }
    
    public init(): Observable<IAuthTokenModel> {
        return this.startupTokenRefresh().pipe(
            tap(() => this.scheduleRefresh()));
    }

    public register(data: IRegisterModel): Observable<any> {
        return this.http1.post("api/v1/account/register", data).pipe(
            catchError(res => throwError(res.error)));
    }

    public login(user: ILoginModel): Observable<any> {
        return this.getTokens(user, "password").pipe(
            catchError(res => throwError(res.error)),
            tap(res => {
                this.scheduleRefresh();
            }));
    }

    public logout(): void {
        this.updateState({ tokens: null });
        
        this.storage.removeAuthTokens();
        this.rolesCheckedService.checkRoles();

        if (this.refreshSubscription$) {
            this.refreshSubscription$.unsubscribe();

    //        console.warn("init hub from logout");
            this.signalRService.initializeHub();
        }
    }

    public refreshTokens(): Observable<IAuthTokenModel> {
        return this.getTokens({ refresh_token: this.storage.getRefreshToken() }, "refresh_token")
                .pipe(catchError(error => throwError("Expired")));
    }

    private updateState(newState: IAuthStateModel): void {
            this.state.next(Object.assign({}, this.state.getValue(), newState));
    }

    private getTokens(data: IRefreshGrantModel | ILoginModel, grantType: string): Observable<IAuthTokenModel> {
        const headers = new HttpHeaders({ 'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8;" });

        Object.assign(data, { scope: "openid offline_access" });

        let params2 = new HttpParams({ fromString: "", encoder: new UriEncoder() });
        params2 = params2.set("grant_type", grantType);
        Object.keys(data)
            .forEach(key => params2 = params2.append(key, data[key]));

        return this.http1.post<IAuthTokenModel>("/connect/token", params2.toString(), { headers: headers }).pipe(
            tap((tokens: IAuthTokenModel) => {
                
                tokens.expiration_date = new Date(new Date().getTime() + tokens.expires_in * 1000).getTime().toString();
                
                this.storage.setAuthTokens(tokens);
                if (tokens.refresh_token) {
                    this.storage.setRefreshToken(tokens.refresh_token);
                }
                this.updateState({ authReady: true, tokens });
                this.getUserProfile();
            }));
    }

    private startupTokenRefresh(): Observable<IAuthTokenModel> {
        return of(this.storage.retrieveTokens()).pipe(
            flatMap((tokens: IAuthTokenModel) => {
                if (!tokens) {
                    this.updateState({ authReady: true });

        //            console.warn("init hub from refresh");
                    this.signalRService.initializeHub();
                    return throwError("No token");
                }

                this.updateState({ tokens });

                if (+tokens.expiration_date > new Date().getTime()) {
                    this.updateState({ authReady: true });
                }

                return this.refreshTokens();
            }),
            catchError(e => {
                this.logout();
                this.updateState({ authReady: true });
                return throwError(e);
            }));
    }

    private scheduleRefresh(): void {
        this.refreshSubscription$ = this.tokens$.pipe(
            first(),
            // refresh every half the total expiration time
            flatMap((tokens: IAuthTokenModel) => interval(tokens.expires_in * 500)),
            flatMap(() => this.refreshTokens()))
            .subscribe();
    }
    
    private getUserProfile(): void {
        this.http.get<any>("role") //bug make list request form service
            .subscribe((data: any) => {
                    this.storage.setUserId(+data.userId);
                    this.storage.setRoles(data.roles.split(", "));
                this.rolesCheckedService.checkRoles();

     //               console.warn("init hub from getUserProfile");
                    this.signalRService.initializeHub();//WARNING---------------------------------------------------------
                }
            );
    }
}