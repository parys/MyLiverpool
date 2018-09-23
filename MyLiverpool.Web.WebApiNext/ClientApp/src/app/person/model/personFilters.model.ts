import { BaseRestFilter } from "@app/+infrastructure";

export class PersonFilters extends BaseRestFilter {
    public name: string;
    public type: number;
}