import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserTransferStateModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { environment } from '@environments/environment';
import { AppModuleShared } from './app.module';
import { AppComponent } from './app.component';
import { GestureConfig } from '../gesture-config';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        AppModuleShared,
        BrowserAnimationsModule,
        BrowserTransferStateModule,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
        HammerModule
    ],
    providers: [
        //   { provide: 'BASE_URL', useFactory: getBaseUrl },
        { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
    ]
})
export class AppModule {
}
