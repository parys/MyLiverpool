import { BaseRestFilter } from "@app/+infrastructure";

export class WishFilter extends BaseRestFilter {
    public typeId? : number;
    public categoryId? : number;
    public filterText?: string;
}