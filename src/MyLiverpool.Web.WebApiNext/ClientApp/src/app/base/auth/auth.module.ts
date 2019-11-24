import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpWrapperModule } from '@base/httpWrapper';
import { StorageService } from '@base/storage';


import { EnsureModuleLoadedOnceGuard } from '@domain/base/ensure-module-loaded-once.guard';
import { LoaderService } from '@base/loader';
import { BearerInterceptor } from './bearer.interceptor';
import { AuthService } from './auth.service';
import { RoleGuard } from './role-guard.service';
import { UnSignedGuard } from './unsigned-guard.service';
import { RolesCheckedService } from './roles-checked.service';
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpWrapperModule
    ]
})
export class AuthModule extends EnsureModuleLoadedOnceGuard {

    static forRoot(): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService,
                RoleGuard,
                UnSignedGuard,
                RolesCheckedService,
                { provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true, deps: [StorageService, LoaderService] },
            ],
        };
    }

    constructor(
        @Optional()
        @SkipSelf()
        parentModule: AuthModule,
    ) {
        super(parentModule);
    }
}
