import { Injectable, Inject } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpEvent,
    HttpHandler,
    HttpErrorResponse,
    HttpResponse,
    HttpHeaders,
    HttpClient
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, catchError, flatMap } from 'rxjs/operators';

import { StorageService } from '@base/storage';
import { IRefreshGrantModel, IAuthTokenModel } from '@base/auth/models';
import { LoaderService } from '@base/loader';

@Injectable()
export class BearerInterceptor implements HttpInterceptor {
    constructor(
        @Inject(StorageService) private storage: StorageService,
        private loaderService: LoaderService
    ) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.show();
        return next.handle(this.addAuth(req)).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.loaderService.hide();
                }
            }),
            catchError(response => {
                if (response instanceof HttpErrorResponse && response.status === 401) {
                    return this.updateTokens(next).pipe(flatMap(() => next.handle(this.addAuth(req))));
                }
                this.loaderService.hide();
                return throwError(response);
            }));
    }

    private addAuth(req: HttpRequest<any>): HttpRequest<any> {
        const tokens = this.storage.getAccessToken();
        return req.clone({
            headers: req.headers.set('Authorization', `Bearer ${tokens}`)
        });
    }

    private updateTokens(handler: HttpHandler): Observable<IAuthTokenModel> {
        const data: IRefreshGrantModel | any = { refresh_token: this.storage.getRefreshToken() };
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;' });

        Object.assign(data, { grant_type: 'refresh_token', scope: 'openid offline_access' });

        const params = new URLSearchParams();
        Object.keys(data)
            .forEach(key => params.append(key, data[key]));
        const http = new HttpClient(handler);
        return http.post<IAuthTokenModel>('/connect/token', params.toString(), { headers }).pipe(
            tap((tokens: IAuthTokenModel) => {

                tokens.expiration_date = new Date(new Date().getTime() + tokens.expires_in * 1000).getTime().toString();

                this.storage.setAuthTokens(tokens);

                console.warn('refreshed!');
            }));
    }
}
