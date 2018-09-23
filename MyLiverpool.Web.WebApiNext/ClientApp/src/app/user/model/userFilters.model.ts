import { BaseRestFilter } from "@app/+infrastructure";

export class UserFilters extends BaseRestFilter {
    page: number = 1;
    userName: string;
    ip: string;
    roleGroupId: number;
}