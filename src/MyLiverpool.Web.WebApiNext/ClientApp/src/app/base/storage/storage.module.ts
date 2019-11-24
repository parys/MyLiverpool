import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { StorageService } from './storage.service';
import { LocalStorage } from './local-storage';
import { EnsureModuleLoadedOnceGuard } from '@domain/base/ensure-module-loaded-once.guard';

export function getStorage() {
    const result = typeof window !== 'undefined' ? window.localStorage : null;
    return result;
}

@NgModule({})
export class StorageModule extends EnsureModuleLoadedOnceGuard {

    static forRoot(): ModuleWithProviders<StorageModule> {
        return {
            ngModule: StorageModule,
            providers: [
                StorageService,
                { provide: LocalStorage, useFactory: getStorage },
            ],
        };
    }

    constructor(
        @Optional()
        @SkipSelf()
        parentModule: StorageModule,
    ) {
        super(parentModule);
    }
}
