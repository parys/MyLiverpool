import { BaseRestFilter } from '@app/+infrastructure';

export class UserFilters extends BaseRestFilter {
    page = 1;
    userName: string;
    ip: string;
    roleGroupId: number;
}
