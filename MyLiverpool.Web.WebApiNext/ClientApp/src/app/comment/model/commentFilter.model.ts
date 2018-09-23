import { BaseRestFilter } from "@app/+infrastructure";

export class CommentFilter extends BaseRestFilter {
    public onlyUnverified: boolean;
    public userId: number;
}