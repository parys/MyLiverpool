import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpWrapper } from '@base/httpWrapper';
import { Person, SquadList, PersonType, PersonFilters } from '@domain/models';
import { PERSONS_ROUTE } from '@constants/routes.constants';
import { BaseRestService } from '@base/infrastructure';

@Injectable()
export class PersonService extends BaseRestService<Person, PersonFilters> {
    private actionUrl: string = PERSONS_ROUTE + '/';

    constructor(public http: HttpWrapper) {
        super(http, PERSONS_ROUTE + '/');
    }

    public setBestPlayer(personId: number): Observable<boolean> {
        return this.http.put<boolean>(`${this.actionUrl}bestPlayer/${personId}`, '');
    }

    public getTypes(): Observable<PersonType[]> {
        return this.http.get<PersonType[]>(this.actionUrl + 'types/');
    }

    public getStuff(type: string): Observable<Person[]> {
        return this.http.get<Person[]>(`${this.actionUrl}stuff?type=${type}`);
    }

    public getSquad(type: string): Observable<SquadList> {
        return this.http.get<SquadList>(`${this.actionUrl}squad?type=${type}`);
    }
}
