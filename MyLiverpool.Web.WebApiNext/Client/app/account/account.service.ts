import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper } from "../shared/index";
import { ResetPassword } from "./resetPassword.model";
import { ChangePassword } from "./changePassword.model";

@Injectable()
export class AccountService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = "account/";
    }

    public confirmEmail = (userId: number, code: string): Observable<boolean> => {
        return this.http.get(this.actionUrl + `confirmEmail?userId=${userId}&code=${code}`).map((res: Response) => res.json());
    };

    public forgotPassword = (email: string): Observable<boolean> => {
        return this.http.get(this.actionUrl + `forgotPassword?email=${email}`).map((res: Response) => res.json());
    };

    public resendConfirmEmail = (email: string): Observable<boolean> => {
        return this.http.get(this.actionUrl + `resendConfirmEmail?email=${email}`).map((res: Response) => res.json());
    };

    public resetPassword = (model: ResetPassword): Observable<any> => {//todo add identityModel
        return this.http.put(this.actionUrl + `resetPassword`, model).map((res: Response) => res.json());
    };

    public changePassword = (model: ChangePassword): Observable<boolean> => {
        return this.http.put(this.actionUrl + `changePassword`, model).map((res: Response) => res.json());
    };

    public isEmailUnique = (email: string): Observable<boolean> => {
        return this.http.get(this.actionUrl + `isEmailUnique?email=${email}`).map((res: Response) => res.json());
    };

    public isUserNameUnique = (userName: string): Observable<boolean> => {
        return this.http.get(this.actionUrl + `isUserNameUnique?username=${userName}`).map((res: Response) => res.json());
    };
}