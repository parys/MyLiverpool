import { NgModule, ModuleWithProviders, Optional, SkipSelf, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';

import { HttpWrapperModule } from '@base/httpWrapper';
import { StorageService } from '@base/storage';


import { EnsureModuleLoadedOnceGuard } from '@domain/base/ensure-module-loaded-once.guard';
import { LoaderService } from '@base/loader';
import { RoleGuard } from './role-guard.service';
import { UnSignedGuard } from './unsigned-guard.service';
import { RolesCheckedService } from './roles-checked.service';
//import { AuthGuard, AdminAuthGuard } from '@auth/guards';
import { AuthHeadersInterceptor } from '@auth/interceptors';
import { AuthService } from '@auth/services';
import { AuthState } from '@auth/store';

export function getAccessToken(injector: Injector): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {

        const router = injector.get(Router);
        const authService = injector.get<AuthService>(AuthService);

        await authService.getUser();

        if (authService.isLoggedIn()) {
            resolve(true);
            return;
        }

        if (location.hash && location.hash.includes('access_token')) {
            await authService.completeAuthentication();
            router.navigateByUrl(authService.redirectUri);
            resolve(true);
            return;
        }

        return authService.signin();
    });
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpWrapperModule,
        NgxsModule.forFeature([AuthState])
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
          //      { provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true, deps: [StorageService, LoaderService] },
                { provide: HTTP_INTERCEPTORS, useClass: AuthHeadersInterceptor, multi: true },
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
