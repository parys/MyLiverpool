import { Injectable } from "@angular/core";

@Injectable()
export class Configuration {
    public apiUrl: string = "api/v1/";
    public serverWithApiUrl: string = this.apiUrl;

    public allowedImageTypes: string[] = [".jpeg", ".jpg", ".png", ".gif", ".bmp"];

    public debounceTime: number = 600;
    public minEmailLength: number = 6;
    public minUserNameLength: number = 3;
    public maxChatMessageLength: number = 1500;
    public minPasswordLength: number = 6;
    public updateUnreadPmCountTime: number = 1000*30;
    public updateUserOnline: number = 1000*30;
    public updateLastComments: number = 1000*60*5;
}