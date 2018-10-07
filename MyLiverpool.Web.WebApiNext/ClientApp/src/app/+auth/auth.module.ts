import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpWrapperModule } from "@app/+httpWrapper";
import { AuthService } from "./auth.service";
import { StorageModule } from "@app/+storage";
import { RoleGuard } from "./role-guard.service";
import { UnSignedGuard } from "./unsigned-guard.service";
import { RolesCheckedService } from "./roles-checked.service";

import {
    AuthModule,
    OidcSecurityService,
    OpenIDImplicitFlowConfiguration,
    OidcConfigService,
    AuthWellKnownEndpoints
} from 'angular-auth-oidc-client';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpWrapperModule,
        StorageModule,
        AuthModule.forRoot()
    ],
    providers: [
        AuthService,
        RoleGuard,
        UnSignedGuard,
        RolesCheckedService,
    ]
})
export class AuthModule { }  