export interface IProfileModel {
    sub: string;
    jti: string;
    useage: string;
    atHash: string;
    nbf: number;
    exp: number;
    iat: number;
    iss: string;

    uniqueName: string;
    emailConfirmed: boolean;
    role: string[];
    roles: string[];
}