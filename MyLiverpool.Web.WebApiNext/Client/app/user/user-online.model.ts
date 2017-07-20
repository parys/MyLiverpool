export class UsersOnline {
    public allCount: number;
    public guestCount: number;
    public users: IUserOnline[];
}

export interface IUserOnline {
    id: number;
    userName: string;
}