import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RolesCheckedService, OidcCustomConfigService } from "@app/+auth";

@Component({
    selector: "sidebar-right",
    templateUrl: "./sidebar-right.component.html",
    styleUrls: ["./sidebar-right.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default
})
export class SidebarRightComponent {
    constructor(public roles: RolesCheckedService,
        private oidc: OidcCustomConfigService) {
    }

    public login(): void {
        this.roles.login();
    }

    public logout(): void {
        this.roles.logout();
    }

    public register(): void {
        window.open(`${this.oidc.authAddr}/account/register`, "_blank");
    }

    public forgot(): void {
        window.open(`${this.oidc.authAddr}/account/forgotPassword`, "_blank");
    }
}