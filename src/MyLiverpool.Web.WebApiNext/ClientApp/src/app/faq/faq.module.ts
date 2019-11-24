import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BreadcrumbService } from '@base/breadcrumbs';
import { SharedModule } from '@shared/index';
import { FAQ_ROUTE } from '@constants/routes.constants';
import { FaqCategoryService } from '@faq-categories/lazy/faq-category.service';
import { PipesModule } from '@base/pipes';
import { FAQ_RU } from '@constants/ru.constants';

import { faqItemRoutes } from '@faq/faq.routes';
import { FaqComponent } from '@faq/faq';
import { FaqService } from '@faq/faq.service';
import { FaqMaterialModule } from '@faq/faq-material.module';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(faqItemRoutes),
        PipesModule,
        FaqMaterialModule
    ],
    declarations: [
        FaqComponent,
    ],
    providers: [
        FaqService,
        FaqCategoryService
    ]
})
export class FaqModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${FAQ_ROUTE}`, FAQ_RU);
    }
}
