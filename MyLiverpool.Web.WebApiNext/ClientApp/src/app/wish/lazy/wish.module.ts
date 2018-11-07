import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { WishListComponent } from "./wish-list";
import { WishEditComponent } from "./wish-edit";
import { WishService } from "./wish.service";
import { wishRoutes } from "./wish.routes";
import { SharedModule, BreadcrumbService } from "@app/shared";
import { RecaptchaModule } from "@app/shared/modules";
import { WISHES_ROUTE, WISHES_RU } from "@app/+constants";
import { MatSelectModule } from "@angular/material";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(wishRoutes),
        RecaptchaModule,
        MatSelectModule
    ],
    declarations: [
        WishEditComponent,
        WishListComponent
    ],
    providers: [
        WishService
    ]
})
export class WishModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${WISHES_ROUTE}`, WISHES_RU);
        this.breadcrumbService.hideRouteRegex(`^/${WISHES_ROUTE}/[0-9]+$`);
    }
}