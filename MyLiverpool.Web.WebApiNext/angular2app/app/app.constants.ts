﻿import { Injectable, Inject } from "@angular/core";

@Injectable()
export class Configuration {

   // constructor(@Inject('BASE_URL') baseUrl: string) {
    constructor() {
   //     this.serverWithApiUrl = baseUrl + this.apiUrl;
    }
    public apiUrl: string = "http://localhost:1669/" + "api/v1/";
    public serverWithApiUrl: string = this.apiUrl;

    public allowedImageTypes: string[] = [".jpeg", ".jpg", ".png", ".gif", ".bmp"];

    public debounceTime: number = 600;
    public minEmailLength: number = 6;
    public minUserNameLength: number = 3;
    public maxChatMessageLength: number = 1500;
    public minPasswordLength: number = 6;
    public updateUnreadPmCountTime: number = 1000*30*2;
    public updateUserOnline: number = 1000*30*4;
    public updateLastComments: number = 1000*60*5;
}