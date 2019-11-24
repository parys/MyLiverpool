import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnsureModuleLoadedOnceGuard } from '@domain/base/ensure-module-loaded-once.guard';

import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbService } from './breadcrumb.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        BreadcrumbComponent,
    ],
    exports: [
        BreadcrumbComponent,
    ]
})
export class BreadcrumbModule extends EnsureModuleLoadedOnceGuard {

    static forRoot(): ModuleWithProviders<BreadcrumbModule> {
        return {
            ngModule: BreadcrumbModule,
            providers: [
                BreadcrumbService
            ]
        };
    }

    constructor(
        @Optional()
        @SkipSelf()
        parentModule: BreadcrumbModule,
    ) {
        super(parentModule);
    }
}
