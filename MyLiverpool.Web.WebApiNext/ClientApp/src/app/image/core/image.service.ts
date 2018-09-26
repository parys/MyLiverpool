import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Image } from "../model";
import { HttpWrapper } from "@app/+httpWrapper";
import { IMAGES_ROUTE } from "@app/+constants";

@Injectable()
export class ImageService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = IMAGES_ROUTE + "/";
    }

    public get(path: string): Observable<Image[]> {
        return this.http.get<Image[]>(`${this.actionUrl}?path=${path}`);
    };

    public uploadImage(files: File[]): Observable<string[]> {
        let formData: FormData = new FormData();
        for(let i: number =0; i< files.length; i++) {
            formData.append("uploadFile", files[i], files[i].name);
        };
        return this.http.post<string[]>(`${this.actionUrl}`, formData, true);
    };

    public uploadBase64Image(imageString: string): Observable<string> {
        return this.http.post<string>(`${this.actionUrl}base64`, JSON.stringify(imageString));
    };
}