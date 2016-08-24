﻿import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../../app.constants';
import { News } from './news.model';
import { Pageable } from '../../shared/pageable.model';

@Injectable()
export class NewsService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private http: Http, private configuration: Configuration) {

        this.actionUrl = configuration.ServerWithApiUrl + 'news/';

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public GetAll = (): Observable<Pageable<News>> => {
        return this.http.get(this.actionUrl).map(res => res.json());
    };

    public GetSingle = (id: number): Observable<News> => {
        return this.http.get(this.actionUrl + id).map(res => res.json());
    };

    public Add = (item: News): Observable<News> => {
        var toAdd = JSON.stringify({ ItemName: item });

        return this.http.post(this.actionUrl, JSON.stringify(item), { headers: this.headers }).map(res => res.json());
    };

    public Update = (id: number, itemToUpdate: News): Observable<News> => {
        // var toUpdate = 
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate), { headers: this.headers })
            .map(res => res.json());
    };

    public Delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map(response => response.json());
    };

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }
}