export class SetUser {
    static readonly type = '[Auth] Set logged user';
    constructor(public payload: { userId: string, userName: string, roles: string[] }) { }
}
