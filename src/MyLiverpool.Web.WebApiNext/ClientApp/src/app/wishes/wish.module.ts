import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule, BreadcrumbService } from '@shared/index';
import { RecaptchaModule } from '@widgets/recaptcha';
import { WISHES_ROUTE } from '@constants/routes.constants';
import { WISHES_RU } from '@constants/ru.constants';

import { WishListComponent, WishEditComponent } from '@wishes/pages';
import { WishService } from '@wishes/wish.service';
import { wishRoutes } from '@wishes/wish.routes';
import { WishMaterialModule } from './wish-material.module';
import { PaginationModule } from '@base/pagination/pagination.module';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(wishRoutes),
        RecaptchaModule,
        WishMaterialModule,
        PaginationModule
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
