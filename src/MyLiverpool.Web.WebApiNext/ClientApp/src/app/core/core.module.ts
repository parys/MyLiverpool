import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxsModule } from '@ngxs/store';

//import { EnsureModuleLoadedOnceGuard } from '@domain/base';
import { CoreState } from '@core/store';
import { EnsureModuleLoadedOnceGuard } from '@domain/base/ensure-module-loaded-once.guard';
// import { UnsavedChangesGuard } from '@core/guards';
// import { IconGenerator } from '@core/services';
//import { RolesResolver, UserGroupsResolver, MonitoringTypesResolver } from '@core/resolvers';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        NgxsModule.forFeature([CoreState])
    ]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                // UnsavedChangesGuard,
                // RolesResolver,
                // UserGroupsResolver,
                // MonitoringTypesResolver,
                // IconGenerator
            ],
        };
    }

    constructor(
        @Optional()
        @SkipSelf()
        parentModule: CoreModule,
    ) {
        super(parentModule);
    }
}
