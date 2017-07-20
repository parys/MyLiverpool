import './polyfills/browser.polyfills';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAppModule } from './app/browser-app.module';
import "hammerjs";

const rootElemTagName = 'app'; // Update this if you change your root component selector

// // Enable either Hot Module Reloading or production mode
if (module['hot']) {
    module['hot'].accept();
    module['hot'].dispose(() => {
        // Before restarting the app, we create a new root element and dispose the old one
        const oldRootElem = document.querySelector(rootElemTagName);
        const newRootElem = document.createElement(rootElemTagName);
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        modulePromise.then(appModule => appModule.destroy());
    });
} else {
    enableProdMode();
}

const modulePromise = platformBrowserDynamic().bootstrapModule(BrowserAppModule);


/* todo old main
import "./polyfills";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { bootstrapWorkerUi } from '@angular/platform-webworker';
import { enableProdMode } from "@angular/core";
import { AppModule } from "./app/app.module";
import "hammerjs";

//enableProdMode();
var rootElemTagName = "app";
// enable either Hot Module Reloading or production mode
if (module["hot"]) {
    module["hot"].accept();
    module["hot"].dispose(() => {
        // Before restarting the app, we create a new root element and dispose the old one
        const oldRootElem = document.querySelector(rootElemTagName);
        const newRootElem = document.createElement(rootElemTagName);
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        platform.destroy();
    });
} else {
    enableProdMode();
}

//bootstrapWorkerUi("./js/webworker.js");
// boot the application, either now or when the DOM content is loaded

const platform = platformBrowserDynamic();
const bootApplication = () => { platform.bootstrapModule(AppModule); };
if (document.readyState === "complete") {
    bootApplication();
} else {
    document.addEventListener("DOMContentLoaded", bootApplication);
}
 */