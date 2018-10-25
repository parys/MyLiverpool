import { Injectable, Inject, Injector } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpErrorResponse, HttpResponse, HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError, flatMap } from "rxjs/operators";
//import { StorageService } from "@app/+storage";
//import { IRefreshGrantModel, IAuthTokenModel } from "@app/+auth";
//import { LoaderService } from "../loader";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Injectable()
export class BearerInterceptor implements HttpInterceptor {
    private oidcSecurityService: OidcSecurityService;
    constructor(
        private injector: Injector
       // @Inject(StorageService) private storage: StorageService,
     //   private loaderService: LoaderService
    ) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //    this.loaderService.show();
        let requestToForward = req;
        if (this.oidcSecurityService === undefined) {
            this.oidcSecurityService = this.injector.get(OidcSecurityService);
        }

        if (this.oidcSecurityService !== undefined) {
            let token = this.oidcSecurityService.getToken();
            if (token !== "") {
                let tokenValue = "Bearer " + token;
                requestToForward = req.clone({ setHeaders: { "Authorization": tokenValue } });
            }
        } else {
            console.debug("OidcSecurityService undefined: NO auth header!");
        }

        return next.handle(requestToForward);
        //   .pipe(
        //   tap(event => {
        //       if (event instanceof HttpResponse) {
        //           this.loaderService.hide();
        //       }
        //   }),
        //   catchError(response => {
        //       if (response instanceof HttpErrorResponse && response.status === 401) {
        ////todo??           return this.updateTokens(next).pipe(flatMap(() => next.handle(this.addAuth(req))));
        //       }
        //       this.loaderService.hide();
        //       return throwError(response);
        //   }));

        //    return next.handle(this.addAuth(req));
    }
    //public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //    this.loaderService.show();
    //    return next.handle(this.addAuth(req)).pipe(
    //        tap(event => {
    //            if (event instanceof HttpResponse) {
    //                this.loaderService.hide();
    //            }
    //        }),
    //        catchError(response => {
    //            if (response instanceof HttpErrorResponse && response.status === 401) {
    //                return this.updateTokens(next).pipe(flatMap(() => next.handle(this.addAuth(req))));
    //            }
    //            this.loaderService.hide();
    //            return throwError(response);
    //        }));
    //}

    //private addAuth(req: HttpRequest<any>): HttpRequest<any> {
    //    const tokens = this.storage.getAccessToken();
    //    return req.clone({
    //        headers: req.headers.set("Authorization", `Bearer ${tokens}`)
    //    });
    //}

    //private updateTokens(handler: HttpHandler): Observable<IAuthTokenModel> {
    //    const data: IRefreshGrantModel = { refresh_token: this.storage.getRefreshToken() };
    //    const headers = new HttpHeaders({ 'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8;" });

    //    Object.assign(data, { grant_type: "refresh_token", scope: "openid offline_access" });

    //    const params = new URLSearchParams();
    //    Object.keys(data)
    //        .forEach(key => params.append(key, data[key]));
    //    const http = new HttpClient(handler);
    //    return http.post<IAuthTokenModel>("/connect/token", params.toString(), { headers: headers }).pipe(
    //        tap((tokens: IAuthTokenModel) => {

    //            tokens.expiration_date = new Date(new Date().getTime() + tokens.expires_in * 1000).getTime().toString();

    //            this.storage.setAuthTokens(tokens);

    //            console.warn("refreshed!");
    //        }));
    //}
}