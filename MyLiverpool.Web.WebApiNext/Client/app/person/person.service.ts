import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { HttpWrapper, Pageable } from "../shared/index";
import { Person } from "./person.model";
import { SquadList } from "./squad-list.model";
import { PersonType } from "./personType.model";

@Injectable()
export class PersonService {
    private actionUrl: string = "person/";

    constructor(private http: HttpWrapper) {
    }

    public getAll = (page: number): Observable<Pageable<Person>> => {
        return this.http.get(this.actionUrl + `list?page=${page}`).map((res: Response) => res.json());
    };

    public getSingle = (id: number): Observable<Person> => {
        return this.http.get(this.actionUrl + id).map((res: Response) => res.json());
    };

    public getBestPlayer = (): Observable<Person> => {
        return this.http.get(this.actionUrl + "bestPlayer/").map((res: Response) => res.json());
    };

    public setBestPlayer = (personId: number): Observable<boolean> => {
        return this.http.put(`${this.actionUrl}bestPlayer/${personId}`, "").map((res: Response) => res.json());
    };

    public create = (item: Person): Observable<Person> => {
        return this.http.post(this.actionUrl, JSON.stringify(item)).map((res: Response) => res.json());
    };

    public update = (id: number, itemToUpdate: Person): Observable<Person> => {
        return this.http
            .put(this.actionUrl + id, JSON.stringify(itemToUpdate))
            .map((res: Response) => res.json());
    };

    public delete = (id: number): Observable<boolean> => {
        return this.http.delete(this.actionUrl + id).map((res: Response) => res.json());
    };

    public getBirthdays = (): Observable<Person[]> => {
        return this.http.get(`${this.actionUrl}birthdays`).map((response: Response) => response.json());
    };

    public getTypes = (): Observable<PersonType[]> => {
        return this.http.get(this.actionUrl + "types/").map((res: Response) => res.json());
    };

    public getStuff = (type: string): Observable<Person[]> => {
        return this.http.get(`${this.actionUrl}stuff?type=${type}`).map((res: Response) => res.json());
    };

    public getSquad = (type:string): Observable<SquadList> => {
        return this.http.get(`${this.actionUrl}squad?type=${type}`).map((res: Response) => res.json());
    };

    public updatePhoto = (name: string, file: File): Observable<string> => {
        let formData: FormData = new FormData();
        formData.append("uploadFile", file, file.name);
        return this.http.post(`${this.actionUrl}photo/${name}`, formData, true).map((response: Response) => response.text());
    };
}