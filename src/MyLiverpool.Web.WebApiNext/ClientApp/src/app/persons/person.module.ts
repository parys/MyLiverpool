import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { PersonListComponent, SquadComponent, StuffListComponent, PersonDetailComponent } from '@persons/pages';

import { personRoutes } from './person.routes';
import { SharedModule } from '@shared/index';
import { PersonService } from './person.service';
import { PersonEditModule } from './shared';
import { BreadcrumbService } from '../base/breadcrumbs';
import { PERSONS_ROUTE, STUFF_ROUTE, SQUAD_ROUTE } from '@constants/routes.constants';
import { PipesModule } from '@base/pipes';
import { PaginationModule } from '@base/pagination/pagination.module';


@NgModule({
    imports: [
        RouterModule.forChild(personRoutes),
        SharedModule,
        PersonEditModule,
        MatTabsModule,
        MatTableModule,
        MatSelectModule,
        MatSortModule,
        MatCardModule,
        MatButtonModule,
        PipesModule,
        PaginationModule
    ],
    declarations: [
        PersonListComponent,
        SquadComponent,
        StuffListComponent,
        PersonDetailComponent
    ],
    providers: [
        PersonService
    ]
})
export class PersonModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${PERSONS_ROUTE}`, 'Люди');
        this.breadcrumbService.hideRouteRegex(`^/${PERSONS_ROUTE}/[0-9]+$`);
        // this.addCallbackForRouteRegex("^/news/[0-9]+$", this.getTitle);
        //   this.addFriendlyNameForRouteRegex("^/persons/[0-9]+/edit$", "Редактирование");
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${STUFF_ROUTE}`, 'Тренерский штаб');
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${STUFF_ROUTE}/first`, 'Первая команда');
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${STUFF_ROUTE}/academy`, 'Академия');
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${SQUAD_ROUTE}`, 'Состав');
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${SQUAD_ROUTE}/first`, 'Первая команда');
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${SQUAD_ROUTE}/academy`, 'Академия');
        this.breadcrumbService.addFriendlyNameForRoute(`/${PERSONS_ROUTE}/${SQUAD_ROUTE}/loan`, 'В аренде');
    }
}
