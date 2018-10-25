import { Injectable, EventEmitter, Output } from '@angular/core';
import { OidcSecurityService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from "angular-auth-oidc-client";

@Injectable({
    providedIn: 'root'
})
export class OidcCustomConfigService {
    @Output() onConfigurationLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    authAddr: any;
    wellKnownEndpoints: any;
    
    async loadConfig(configUrl: string) {
        try {
            const response = await fetch(configUrl);
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            this.authAddr = await response.json();
            await this.loadSSOConfig(this.authAddr);
        } catch (err) {
            console.error(`ConfigService 'loadConfig' threw an error on calling ${configUrl}`, err);
            this.onConfigurationLoaded.emit(false);
        }
    }

    async loadSSOConfig(stsServer: string) {
        try {
            const response = await fetch(`${stsServer}/.well-known/openid-configuration`);

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            this.wellKnownEndpoints = await response.json();
            this.onConfigurationLoaded.emit(true);
        } catch (err) {
            console.error(`ConfigService 'loadSSOConfig' threw an error on calling ${stsServer}`, err);
            this.onConfigurationLoaded.emit(false);
        }
    }

    setupSSO(oidcSecurityService: OidcSecurityService) {
        const c = new OpenIDImplicitFlowConfiguration();
        c.stsServer = this.authAddr;
        c.redirect_url = window.location.origin;
        c.client_id = "ng";
        c.response_type = 'id_token token';
        c.scope = 'openid profile role offline_access apiV1';
        c.post_logout_redirect_uri = window.location.origin + '/';
        c.forbidden_route = '/';
        c.unauthorized_route = '/';
        c.auto_userinfo = true;
        c.log_console_warning_active = true;
        c.log_console_debug_active = true;
        c.max_id_token_iat_offset_allowed_in_seconds = 10;
        c.start_checksession = false;
        c.silent_renew = false;
        const wn = new AuthWellKnownEndpoints();
        wn.setWellKnownEndpoints(this.wellKnownEndpoints);
        oidcSecurityService.setupModule(c, wn);
    }
}