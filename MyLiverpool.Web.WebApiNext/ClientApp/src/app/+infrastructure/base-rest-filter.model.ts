export class BaseRestFilter {
    public page: number;
    public itemsPerPage: number = 15;
    public order: string;
    public sortBy: string;
}