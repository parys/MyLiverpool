import { NgModule } from '@angular/core';
import { StorageService } from './storage.service';
import { LocalStorage } from './local-storage';

export function getStorage() {
    const result = typeof window !== 'undefined' ? window.localStorage : null;
    return result;
}

@NgModule({
    providers: [
        StorageService,
        { provide: LocalStorage, useFactory: getStorage },
        ]
})
export class StorageModule { }
