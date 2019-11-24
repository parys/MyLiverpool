import { NgModule, LOCALE_ID, Injectable } from '@angular/core';
import {
    BrowserModule,
    HammerGestureConfig,
    HAMMER_GESTURE_CONFIG, } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeRU from '@angular/common/locales/ru';

import { BreadcrumbService } from '@base/breadcrumbs';
import { AppComponent } from './app.component';
import { ChatModule } from './chat';
import * as home from './home';
import { LayoutModule } from '@layout/layout.module';
import { MaterialCoreModule } from '@materials/core';
import { SharedModule, CustomTitleMetaService } from './shared';
import { AccountCoreModule } from '@accounts/core';
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { PipesModule } from './base/pipes';
import { SignalRModule } from '@base/signalr';
import { AuthModule } from '@base/auth';
import { StorageModule } from '@base/storage';
import { LoaderModule } from '@base/loader';
import { BreadcrumbModule } from '@base/breadcrumbs/breadcrumb.module';

registerLocaleData(localeRU);

declare var Hammer: any;
@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
    buildHammer(element: HTMLElement) {
        const mc = new Hammer(element, {
            touchAction: 'pan-y',
            cssProps: {
                userSelect: 'auto',
            }
        });
        return mc;
    }
}

// @Injectable()
// export class UIErrorHandler extends ErrorHandler {
//    constructor() {
//        super();
//    }
//    handleError(error: any) {
//        super.handleError(error);
//        alert(`Error occurred:${error.message}`);
//    }
// }

@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: 'mylfc' }),
        SharedModule,
        HttpClientModule,
        AccountCoreModule,
        ChatModule,
        LayoutModule,
        MaterialCoreModule,
        AppRoutingModule,
        AppMaterialModule,
        PipesModule,
        StorageModule.forRoot(),
        SignalRModule.forRoot(),
        AuthModule.forRoot(),
        LoaderModule.forRoot(),
        BreadcrumbModule.forRoot(),
    ],
    declarations: [
        home.NavbarComponent,
        home.NavbarMenuComponent,
        home.SidebarLeftComponent,
        home.SidebarRightComponent,
        AppComponent,
    ],
    exports: [
        home.NavbarMenuComponent
    ],
    providers: [
        BreadcrumbService,
        CustomTitleMetaService,
        { provide: LOCALE_ID, useValue: 'ru-RU' },
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig,
        },
        // {
        //    provide: ErrorHandler,
        //    useClass: UIErrorHandler
        // }
    ]
})
export class AppModuleShared { }
