import { NgModule, APP_INITIALIZER  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpWrapperModule } from "@app/+httpWrapper";
import { StorageModule } from "@app/+storage";
import { RoleGuard } from "./role-guard.service";
import { UnSignedGuard } from "./unsigned-guard.service";
import { RolesCheckedService } from "./roles-checked.service";
import { AuthModule, OidcSecurityService } from 'angular-auth-oidc-client';
import { OidcCustomConfigService } from "./oidc-custom-config.service";
//import { StorageService } from "../+storage/storage.service";
import { LoaderService } from "../shared/loader/loader.service";
import { BearerInterceptor } from "./interceptors/bearer.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

export function loadConfig(configService: OidcCustomConfigService) {
    console.log('APP_INITIALIZER STARTING');
    return () => configService.loadConfig(`/api/v1/helpers/authAddress`);
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpWrapperModule,
        StorageModule,
        AuthModule.forRoot()
    ],
    providers: [
 //       AuthService,
        OidcSecurityService,
        RoleGuard,
      //  RoleGuard2,
        UnSignedGuard,
        RolesCheckedService,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfig,
            multi: true,
            deps: [OidcCustomConfigService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BearerInterceptor,
            multi: true,
            //deps: []
        },
        OidcCustomConfigService
    ]
})
export class AuthCustomModule {
    constructor(
        private oidcSecurityService: OidcSecurityService,
        private configService: OidcCustomConfigService,
    ) {
      //  registerLocaleData(localeTr, 'tr');

        this.configService.onConfigurationLoaded.subscribe(() => this.configService.setupSSO(this.oidcSecurityService));
        console.log('APP STARTING');
    }
}  