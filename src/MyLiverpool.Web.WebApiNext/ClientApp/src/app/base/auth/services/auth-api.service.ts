import { Injectable } from '@angular/core';

import { UserManager, User } from 'oidc-client';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Store } from '@ngxs/store';

import { environment } from '@environments/environment';

import { SetUser } from '@auth/store';
import { IRegisterModel } from '@auth/models';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


@Injectable()
export class AuthService {

    private _authStatusSource = new BehaviorSubject<boolean>(false);

    private _manager = new UserManager(environment.auth);

    private _user: User;

    constructor(private store: Store,
                private http1: HttpClient) { }

    public get user(): User {
        return this._user;
    }

    public set user(user: User) {
        this._user = user;
        this._authStatusSource.next(this.isLoggedIn());
    }

    public get redirectUri(): string {
        return localStorage.getItem('redirect_uri');
    }

    public set redirectUri(uri: string) {
        localStorage.setItem('redirect_uri', uri);
    }

    public authStatus$ = this._authStatusSource.asObservable();

    public getUser(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this._manager.getUser()
                .then(user => {
                    this.user = user;
                    this.setProfile(user);
                    resolve(user);
                });
        });
    }

    public signin() {
        this.redirectUri = `${location.pathname || ''}${location.search || ''}` || '/';
        return this._manager.signinRedirect();
    }

    public signout() {
        this._manager.signoutRedirect();
    }

    public isLoggedIn(): boolean {
        return this.user != null && !this.user.expired;
    }

    public completeAuthentication() {
        return new Promise<User>((resolve, rejects) => {
            this._manager.signinRedirectCallback()
                .then(user => {
                    this.user = user;
                    this.setProfile(user);
                    resolve(user);
                });
        });
    }

    public get authorizationHeader(): string {
        return `${this.user.token_type} ${this.user.access_token}`;
    }

    private setProfile(user: User): void {
        console.warn(user);
        if (user) {
            const profile = user.profile;
            this.store.dispatch(new SetUser({
                userId: profile.sub,
                userName: profile.name,
                roles: Array.isArray(profile.role) ? profile.role : [profile.role]
            }));
        }
        //   siteId: profile.siteId
    }

    // old stuff

    public register(data: IRegisterModel): Observable<any> {
        return this.http1.post(environment + 'api/v1/account/register', data).pipe(
            catchError(res => throwError(res.error)));
    }

}
