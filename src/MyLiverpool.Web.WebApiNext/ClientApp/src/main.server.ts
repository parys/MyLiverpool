import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModule, renderModuleFactory } from '@angular/platform-server';
import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { createServerRenderer } from 'aspnet-prerendering';
export { AppServerModule } from './app/app.module.server';
// import { COOKIES } from './app/app.models';
import { InjectionToken } from '@angular/core';

export const COOKIES = new InjectionToken<string>('COOKIES');
// This allows to set cookies on server
// Only cookie used in this app is culture cookie
// import * as xhr2 from 'xhr2';
// xhr2.prototype._restrictedHeaders = {};

enableProdMode();

export default createServerRenderer(params => {
    const { AppServerModule, AppServerModuleNgFactory, LAZY_MODULE_MAP } = (module as any).exports;
    const options = {
        document: params.data.originalHtml,
        url: params.url,
        extraProviders: [
            provideModuleMap(LAZY_MODULE_MAP),
            { provide: APP_BASE_HREF, useValue: params.baseUrl },
            { provide: 'BASE_URL', useValue: params.origin + params.baseUrl },
            { provide: COOKIES, useValue: params.data.cookies }
        ]
    };

    const renderPromise = AppServerModuleNgFactory
        ? /* AoT */ renderModuleFactory(AppServerModuleNgFactory, options)
        : /* dev */ renderModule(AppServerModule, options);

    return renderPromise.then(html => {
        return {
            html
        };
    });

});

// import { enableProdMode } from "@angular/core";
// import { createServerRenderer } from "aspnet-prerendering";
// import { AppModule } from "./app/app.module.server";
// import { ngAspnetCoreEngine, IEngineOptions, createTransferScript } from "@nguniversal/aspnetcore-engine";


// enableProdMode();

// export default createServerRenderer(params => {
//    // Platform-server provider configuration
//    const setupOptions: IEngineOptions = {
//        appSelector: "<app></app>",
//        ngModule: AppModule,
//        request: params,
//        providers: [
//            // Optional - Any other Server providers you want to pass (remember you'll have to provide them for the Browser as well)
//        ]
//    };

//    // ***** Pass in those Providers & your Server NgModule, and that's it!
//    return ngAspnetCoreEngine(setupOptions).then(response => {

//        // Want to transfer data from Server -> Client?

//        // Add transferData to the response.globals Object, and call createTransferScript({}) passing in the Object key/values of data
//        // createTransferScript() will JSON Stringify it and return it as a <script> window.TRANSFER_CACHE={}</script>
//        // That your browser can pluck and grab the data from
//        response.globals.transferData = createTransferScript({
//            someData: 'Transfer this to the client on the window.TRANSFER_CACHE {} object',
//            fromDotnet: params.data.thisCameFromDotNET // example of data coming from dotnet, in HomeController
//        });

//        return ({
//            html: response.html,
//            globals: response.globals
//        });
//    });
// });
