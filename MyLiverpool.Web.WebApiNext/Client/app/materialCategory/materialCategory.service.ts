import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { MaterialCategory } from "./materialCategory.model";
import { MaterialType } from "./materialType.enum";
import { HttpWrapper } from "../shared/httpWrapper";

@Injectable()
export class MaterialCategoryService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = "materialCategory/";
    }

    getAll = (type: MaterialType): Observable<MaterialCategory[]> => {
        return this.http.get(`${this.actionUrl}${MaterialType[type]}/`).map((response: Response) => response.json());
    };

    getSingle = (id: number): Observable<MaterialCategory> => {
        return this.http.get(this.actionUrl + id).map((response: Response) => response.json());
    };

    create = (item: MaterialCategory, type: MaterialType): Observable<MaterialCategory> => {
        return this.http.post(`${this.actionUrl}${MaterialType[type]}/`, JSON.stringify(item)).map((response: Response) => response.json());
    };

    update = (id: number, itemToUpdate: MaterialCategory): Observable<MaterialCategory> => {
        return this.http.put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((response: Response) => response.json());
    };

    delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((response: Response) => response.json());
    };
}