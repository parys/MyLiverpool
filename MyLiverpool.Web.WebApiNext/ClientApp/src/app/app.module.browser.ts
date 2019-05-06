import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppModuleShared } from './app.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserTransferStateModule } from '@angular/platform-browser';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        AppModuleShared,
        BrowserAnimationsModule,
        BrowserTransferStateModule,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        //   { provide: 'BASE_URL', useFactory: getBaseUrl }
    ]
})
export class AppModule {
}

// export function getBaseUrl() {
//    return document.getElementsByTagName("base")[0].href;
// }
