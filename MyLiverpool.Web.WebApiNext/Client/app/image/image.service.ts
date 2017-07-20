import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Image } from "./image.model";
import { HttpWrapper } from "../shared/httpWrapper";

@Injectable()
export class ImageService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = "image/";
    }

    get = (path: string): Observable<Image[]> => {
        return this.http.get(`${this.actionUrl}?path=${path}`).map((response: Response) => response.json());
    };

    uploadImage = (files: File[]): Observable<string[]> => {
        let formData: FormData = new FormData();
        for(let i: number =0; i< files.length; i++) {
            formData.append("uploadFile", files[i], files[i].name);
        };
        return this.http.post(`${this.actionUrl}`, formData, true).map((response: Response) => response.json() as string[]);
    };
}