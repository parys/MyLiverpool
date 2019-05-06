import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WishListComponent } from './wish-list';
import { WishEditComponent } from './wish-edit';
import { WishService } from './wish.service';
import { wishRoutes } from './wish.routes';
import { SharedModule, BreadcrumbService } from '@app/shared';
import { RecaptchaModule } from '@app/shared/modules';
import { WISHES_ROUTE, WISHES_RU } from '@app/+constants';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(wishRoutes),
        RecaptchaModule,
        MatSelectModule,
        MatInputModule
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
