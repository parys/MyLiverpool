import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { ResetPassword, ChangePassword } from "../model";
import { ACCOUNT_ROUTE } from "@app/+constants";

@Injectable()
export class AccountService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = ACCOUNT_ROUTE + "/";
    }

    public confirmEmail(userId: number, code: string): Observable<boolean> {
        return this.http.get<boolean>(this.actionUrl + `confirmEmail?userId=${userId}&code=${code}`);
    };

    public forgotPassword(email: string): Observable<boolean> {
        return this.http.get<boolean>(this.actionUrl + `forgotPassword?email=${email}`);
    };

    public resendConfirmEmail(email: string): Observable<boolean> {
        return this.http.get<boolean>(this.actionUrl + `resendConfirmEmail?email=${email}`);
    };

    public resetPassword(model: ResetPassword): Observable<any> {//todo add identityModel
        return this.http.put<any>(this.actionUrl + `resetPassword`, model);
    };

    public changePassword(model: ChangePassword): Observable<boolean> {
        return this.http.put<boolean>(this.actionUrl + `changePassword`, model);
    };

    public isEmailUnique(email: string): Observable<boolean> {
        return this.http.get<boolean>(this.actionUrl + `isEmailUnique?email=${email}`);
    };

    public isUserNameUnique(userName: string): Observable<boolean> {
        return this.http.get<boolean>(this.actionUrl + `isUserNameUnique?username=${userName}`);
    };
}