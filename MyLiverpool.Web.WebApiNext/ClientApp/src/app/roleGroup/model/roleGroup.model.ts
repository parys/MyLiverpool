import { Role } from "./role.model";
export class RoleGroup {
    public id: number;
    public name: string;
    public russianName: string;
    public roles: Role[];
}