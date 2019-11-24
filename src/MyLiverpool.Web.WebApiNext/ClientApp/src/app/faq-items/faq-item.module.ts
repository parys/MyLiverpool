import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

import { BreadcrumbService } from '@base/breadcrumbs';
import { SharedModule } from '@shared/index';
import { FAQ_CATEGORIES_ROUTE } from '@constants/routes.constants';
import { FAQ_CATEGORIES_RU } from '@constants/ru.constants';
import { EditorModule } from '@editor/index';

import { faqItemRoutes } from './faq-item.routes';
import { FaqItemEditComponent } from './faq-item-edit';
import { FaqItemListComponent } from './faq-item-list';
import { FaqItemService } from './faq-item.service';
import { FaqCategoryService } from '@faq-categories/lazy/faq-category.service';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(faqItemRoutes),
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        EditorModule,
        MatButtonModule
    ],
    declarations: [
        FaqItemEditComponent,
        FaqItemListComponent
    ],
    providers: [
        FaqCategoryService,
        FaqItemService
    ]
})
export class FaqItemModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${FAQ_CATEGORIES_ROUTE}`, FAQ_CATEGORIES_RU);
        this.breadcrumbService.hideRouteRegex(`^/${FAQ_CATEGORIES_ROUTE}/[0-9]+$`);
    }
}
