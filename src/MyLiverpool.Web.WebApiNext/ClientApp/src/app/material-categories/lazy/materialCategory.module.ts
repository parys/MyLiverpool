import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

import { SharedModule } from '@shared/index';
import { BreadcrumbService } from '@base/breadcrumbs';
import { BLOG_CATEGORIES_ROUTE, NEWS_CATEGORIES_ROUTE } from '@constants/index';

import { materialCategoryRoutes } from '@material-categories/lazy/materialCategory.routes';
import { MaterialCategoryListComponent } from '@material-categories/lazy/materialCategory-list';
import { MaterialCategoryEditComponent } from '@material-categories/lazy/materialCategory-edit';
import { MaterialCategoryCoreModule } from '@material-categories/core';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(materialCategoryRoutes),
        MaterialCategoryCoreModule,
        MatInputModule
    ],
    declarations: [
        MaterialCategoryListComponent,
        MaterialCategoryEditComponent
    ]
})
export class MaterialCategoryModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${BLOG_CATEGORIES_ROUTE}`, 'Категории блогов');
        this.breadcrumbService.hideRouteRegex(`^/${BLOG_CATEGORIES_ROUTE}/[0-9]+$`);
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${NEWS_CATEGORIES_ROUTE}`, 'Категории новостей');
        this.breadcrumbService.hideRouteRegex(`^/${NEWS_CATEGORIES_ROUTE}/[0-9]+$`);
    }
}
