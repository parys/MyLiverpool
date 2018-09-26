import { Injectable } from "@angular/core";
import { HttpWrapper } from "@app/+httpWrapper";
import { Stadium, StadiumFilters } from "../model";
import { STADIUMS_ROUTE } from "@app/+constants";
import { BaseRestService } from "@app/+infrastructure";

@Injectable()
export class StadiumService extends BaseRestService<Stadium, StadiumFilters> {
    private actionUrl: string = STADIUMS_ROUTE + "/";

    constructor(public http: HttpWrapper) {
        super(http, STADIUMS_ROUTE + "/");
    }
}