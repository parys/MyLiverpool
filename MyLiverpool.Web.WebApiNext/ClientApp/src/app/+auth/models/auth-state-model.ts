import { IAuthTokenModel } from "./auth-token-model";

export interface IAuthStateModel {
    tokens?: IAuthTokenModel;
    authReady?: boolean;
}