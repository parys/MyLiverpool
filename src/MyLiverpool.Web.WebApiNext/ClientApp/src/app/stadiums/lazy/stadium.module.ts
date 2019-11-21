import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { StadiumListComponent } from '@stadiums/lazy/stadium-list';
import { StadiumEditComponent } from '@stadiums/lazy/stadium-edit';
import { stadiumRoutes } from '@stadiums/lazy/stadium.routes';
import { SharedModule } from '@shared/index';
import { StadiumCoreModule } from '@stadiums/core';
import { BreadcrumbService } from '@shared/breadcrumb';
import { STADIUMS_ROUTE } from '@constants/routes.constants';
import { STADIUMS_RU } from '@constants/ru.constants';
import { MatButtonModule } from '@angular/material/button';
import { PaginationModule } from '@base/pagination/pagination.module';

@NgModule({
    imports: [
        RouterModule.forChild(stadiumRoutes),
        SharedModule,
        StadiumCoreModule,
        MatInputModule,
        MatSortModule,
        MatTableModule,
        MatButtonModule,
        PaginationModule
    ],
    declarations: [
        StadiumEditComponent,
        StadiumListComponent
    ]
})
export class StadiumModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${STADIUMS_ROUTE}`, STADIUMS_RU);
        this.breadcrumbService.hideRouteRegex(`^/${STADIUMS_ROUTE}/[0-9]+$`);
    }
}
