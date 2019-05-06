import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { walRoutes } from './wal.routes';
import { SharedModule, BreadcrumbService } from '@app/shared';
import { WAL_ROUTE, WAL_RU } from '@app/+constants';
import { WalMainComponent } from './wal-main';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(walRoutes)
    ],
    declarations: [
        WalMainComponent
    ]
})
export class WalModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${WAL_ROUTE}`, WAL_RU);
    }
}
