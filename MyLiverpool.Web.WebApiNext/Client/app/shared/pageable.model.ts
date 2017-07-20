export class Pageable<T> {
    list: T[];
    pageNo: number;
    totalItems: number;
    itemPerPage: number;
}