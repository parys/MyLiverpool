import { IAuthTokenModel } from "./auth-tokens-model";
import { IProfileModel } from "./profile-model";

export interface IAuthStateModel {
    tokens?: IAuthTokenModel;
    profile?: IProfileModel;
    authReady?: boolean;
}