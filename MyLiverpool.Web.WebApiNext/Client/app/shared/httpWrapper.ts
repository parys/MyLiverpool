import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { LocalStorageService } from "./localStorage.service";
import { Configuration } from "../app.constants";
import { Router } from "@angular/router";
import { IAuthTokenModel } from "../auth/models/auth-tokens-model";

@Injectable()
export class HttpWrapper {
    constructor(private http: Http
        , private localStorage: LocalStorageService
        , private configuration: Configuration,
        private router: Router
    ) { }

    public get(url: string): Observable<Response> {
        return this.http.get(this.configuration.serverWithApiUrl + url, {
            headers: this.updateHeaders(),
            body: ""
        });
    }  

    public post(url: string, data: any, withFiles: boolean = false): Observable<Response> {
        return this.http.post(this.configuration.serverWithApiUrl + url, data, {
            headers: this.updateHeaders(withFiles)
        });
    }

    public put(url: string, data: any): Observable<Response> {
        return this.http.put(this.configuration.serverWithApiUrl + url, data, {
            headers: this.updateHeaders()
        });
    }

    public delete(url: string): Observable<Response> {
        return this.http.delete(this.configuration.serverWithApiUrl + url, {
            headers: this.updateHeaders(),
            body: ""
        });
    }

    private retrieveTokens(): IAuthTokenModel {
        const tokensString = localStorage.getItem("auth-tokens");
        const tokensModel: IAuthTokenModel = tokensString == null ? null : JSON.parse(tokensString);
        return tokensModel;
    }

    private updateHeaders(withFiles: boolean = false): Headers {
        let headers: Headers = new Headers();
        if (withFiles) {
            headers.append("Accept", "application/json");
        } else {
            headers.append("Content-type", "application/json");
        }
        let tokens = this.retrieveTokens();
        if (tokens) {
            headers.append("Authorization", "Bearer " + tokens.access_token);
        }
        return headers;
    }

    private parseLoginAnswer(item: any): void {
        this.localStorage.setAuthTokens(item);
    }
}