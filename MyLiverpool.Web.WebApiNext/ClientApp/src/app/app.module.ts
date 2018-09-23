import { NgModule, LOCALE_ID, Injectable, ErrorHandler } from "@angular/core";
import {
    BrowserModule,
    HammerGestureConfig,
    HAMMER_GESTURE_CONFIG, } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
//import { PrebootModule } from "preboot";

import localeRU from "@angular/common/locales/ru";
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";
//import { ForumModule } from "./forum";
import { ChatModule } from "./chat";
import * as home from "./home";
import { InjuryCoreModule } from "./injury";
import { MatchCoreModule } from "./match";
import { MaterialCoreModule } from "./material";
import { PersonCoreModule } from "./person";
import { SharedModule } from "./shared";
import * as admin from "./admin";
import { AccountCoreModule } from "./account";
import { TransferCoreModule } from "./transfer";
import { CommentCoreModule } from "./comment";
import { NotificationCoreModule } from "./notification";
import { UserCoreModule } from "./user";

registerLocaleData(localeRU);
import { PollCoreModule } from "./poll";

declare var Hammer: any;

export class MyHammerConfig extends HammerGestureConfig {
    buildHammer(element: HTMLElement) {
        const mc = new Hammer(element, {
            touchAction: "pan-y",
            cssProps: {
                userSelect: "auto",
            }
        });
        return mc;
    }
}


@Injectable()
export class UIErrorHandler extends ErrorHandler {
    constructor() {
        super();
    }
    handleError(error: any) {
        super.handleError(error);
        alert(`Error occurred:${error.message}`);
    }
}

@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: "mylfc" }),
        //    PrebootModule.withConfig({ appRoot: "app" }),
        SharedModule,
        HttpClientModule,
        AccountCoreModule,
        //  ForumModule,
        InjuryCoreModule,
        ChatModule,
        CommentCoreModule,
        MatchCoreModule,
        TransferCoreModule,
        MaterialCoreModule,
        NotificationCoreModule,
     //   PollCoreModule,
        PersonCoreModule,
        RouterModule.forRoot(routes, {
            onSameUrlNavigation: "reload",
            initialNavigation: "enabled",
            anchorScrolling: "enabled",
            scrollPositionRestoration: "enabled"
        }),
        UserCoreModule
    ],
    declarations: [
        home.StaticPageComponent,
        home.NavbarComponent,
        home.NavbarMenuComponent,
        home.SidebarLeftComponent,
        home.SidebarRightComponent,
        AppComponent,
        admin.CupTableComponent,
        admin.EplTableComponent,
        admin.PageEditorComponent,
    ],
    exports: [
        home.NavbarMenuComponent
    ],
    providers: [// services
        admin.AdminService,
        { provide: LOCALE_ID, useValue: "ru-RU" },
        {
            // hammer instantion with custom config
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig,
        },
        //{
        //    provide: ErrorHandler,
        //    useClass: UIErrorHandler
        //}
    ]
})
export class AppModuleShared { }