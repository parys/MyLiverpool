import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { SignalRService } from '@base/signalr/signalr.common.service';
import { StorageModule } from '@base/storage';
import { EnsureModuleLoadedOnceGuard } from '@domain/base/ensure-module-loaded-once.guard';

@NgModule({
    imports: [
        StorageModule
    ]
})
export class SignalRModule extends EnsureModuleLoadedOnceGuard {

    static forRoot(): ModuleWithProviders<SignalRModule> {
        return {
            ngModule: SignalRModule,
            providers: [
                SignalRService
            ],
        };
    }

    constructor(
        @Optional()
        @SkipSelf()
        parentModule: SignalRModule,
    ) {
        super(parentModule);
    }
}
