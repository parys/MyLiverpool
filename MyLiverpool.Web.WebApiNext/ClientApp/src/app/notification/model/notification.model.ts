export class Notification {
    public id: number;
    public type: number;
    public typeName: string;
    public entityId: number;
    public commentId: number;
    public text: string;
    public isRead: boolean;
    public dateTime: Date;

    public getRoute(): string {
        return `/${this.typeName}${this.entityId}`;
    }

    public getFragment(): string {
        return this.commentId ? `com${this.commentId}` : '';
    }
}
