import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MaterialCategory, MaterialType } from "../model";
import { HttpWrapper } from "@app/+httpWrapper";
import { MATERIAL_CATEGORIES_ROUTE } from "@app/+constants";

@Injectable()
export class MaterialCategoryService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = MATERIAL_CATEGORIES_ROUTE + "/";
    }

    public getAll(type: MaterialType): Observable<MaterialCategory[]> {
        return this.http.get<MaterialCategory[]>(`${this.actionUrl}${MaterialType[type]}/`);
    };

    public getSingle(id: number): Observable<MaterialCategory> {
        return this.http.get<MaterialCategory> (this.actionUrl + id);
    };

    public create(item: MaterialCategory, type: MaterialType): Observable<MaterialCategory> {
        return this.http.post<MaterialCategory>(`${this.actionUrl}${MaterialType[type]}/`, JSON.stringify(item));
    };

    public update(id: number, itemToUpdate: MaterialCategory): Observable<MaterialCategory> {
        return this.http.put<MaterialCategory>(this.actionUrl + id, JSON.stringify(itemToUpdate));
    };

    public delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(this.actionUrl + id);
    };
}