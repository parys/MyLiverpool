import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Material } from "./material.model";
import { MaterialType } from "../materialCategory/materialType.enum";
import { Pageable } from "../shared/pageable.model";
import { HttpWrapper } from "../shared/httpWrapper";
import { MaterialFilters } from "./materialFilters.model";

@Injectable()
export class MaterialService {
    private actionUrl: string;

    constructor(private http: HttpWrapper) {
        this.actionUrl = "material/";
    }

    public getAll = (filters: MaterialFilters): Observable<Pageable<Material>> => {
        return this.http.get(this.actionUrl + "list/" + encodeURIComponent(JSON.stringify(filters))).map((res: Response) => res.json());
    };

    public getSingle = (id: number): Observable<Material> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };

    public create = (item: Material, type: MaterialType): Observable<Material> => {
        return this.http.post(`${this.actionUrl}${MaterialType[type]}/`, JSON.stringify(item)).map((res: Response) => res.json());
    };

    public update = (id: number, itemToUpdate: Material): Observable<Material> => {
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };

    public delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((res: Response) => res.json());
    };

    public addView = (id: number): Observable<boolean> => {
        return this.http.get(this.actionUrl + "addView/" + id).map((res: Response) => res.json());
    };

    public activate = (id: number): Observable<boolean> => {
        return this.http.get(this.actionUrl + "activate/" + id).map((res: Response) => res.json());
    };

    public extractPhoto = (url: string): Observable<string[]> => {
        return this.http.get(this.actionUrl + "imageLinks/" + url).map((res: Response) => res.json());
    }
}