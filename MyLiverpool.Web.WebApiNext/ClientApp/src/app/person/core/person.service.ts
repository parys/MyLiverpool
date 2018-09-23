import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapper } from "@app/+httpWrapper";
import { Person, SquadList, PersonType, PersonFilters } from "@app/person/model";
import { PERSONS_ROUTE } from "@app/+constants";
import { BaseRestService } from "@app/+infrastructure";

@Injectable()
export class PersonService extends BaseRestService<Person, PersonFilters> {
    private actionUrl: string = PERSONS_ROUTE + "/";

    constructor(public http: HttpWrapper) {
        super(http, PERSONS_ROUTE + "/");
    }

    public getBestPlayer(): Observable<Person> {
        return this.http.get<Person>(this.actionUrl + "bestPlayer/");
    };

    public setBestPlayer(personId: number): Observable<boolean> {
        return this.http.put<boolean>(`${this.actionUrl}bestPlayer/${personId}`, "");
    };
    
    public getBirthdays(): Observable<Person[]> {
        return this.http.get<Person[]>(`${this.actionUrl}birthdays`);
    };

    public getTypes(): Observable<PersonType[]> {
        return this.http.get<PersonType[]>(this.actionUrl + "types/");
    };

    public getStuff(type: string): Observable<Person[]> {
        return this.http.get<Person[]>(`${this.actionUrl}stuff?type=${type}`);
    };

    public getSquad(type:string): Observable<SquadList> {
        return this.http.get<SquadList>(`${this.actionUrl}squad?type=${type}`);
    };

    public updatePhoto(name: string, file: File): Observable<Object> {
        const formData: FormData = new FormData();
        formData.append("uploadFile", file, file.name);
        return this.http.post<Object>(`${this.actionUrl}photo/${name}`, formData, true);
    };
}