import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/index';
import { StadiumCoreModule } from '@stadiums/core';
import { BreadcrumbService } from '@shared/breadcrumb';
import { CLUBS_ROUTE } from '@constants/routes.constants';
import { CLUBS_RU } from '@constants/ru.constants';

import { clubRoutes } from '@clubs/club.routes';
import { ClubEditComponent } from '@clubs/pages/club-edit';
import { ClubListComponent } from '@clubs/pages/club-list';
import { ClubMaterialModule } from '@clubs/club-material.module';
import { ClubService } from '@clubs/club.service';
import { PaginationModule } from '@base/pagination/pagination.module';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(clubRoutes),
        StadiumCoreModule,
        ClubMaterialModule,
        PaginationModule
    ],
    declarations: [
        ClubEditComponent,
        ClubListComponent
    ],
    providers: [
        ClubService
    ]
})
export class ClubModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${CLUBS_ROUTE}`, CLUBS_RU);
        this.breadcrumbService.hideRouteRegex(`^/${CLUBS_ROUTE}/[0-9]+$`);
    }
}
