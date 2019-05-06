import './polyfills/browser.polyfills';
import { AppModule } from './app/app.module.browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
} else {
  //  Error["stackTraceLimit"] = Infinity;
  //  require("zone.js/dist/long-stack-trace-zone");
}

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

const providers = [
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: <any[]>[] },
];

document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic(providers).bootstrapModule(AppModule)
        .catch(err => console.log(err));
});
