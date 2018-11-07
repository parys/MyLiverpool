import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { materialCategoryRoutes } from "./materialCategory.routes";
import { MaterialCategoryListComponent } from "./materialCategory-list";
import { MaterialCategoryEditComponent } from "./materialCategory-edit";
import { MaterialCategoryCoreModule } from "../core";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { BLOG_CATEGORIES_ROUTE, NEWS_CATEGORIES_ROUTE } from "@app/+constants";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(materialCategoryRoutes),
        MaterialCategoryCoreModule
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
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${BLOG_CATEGORIES_ROUTE}`, "Категории блогов");
        this.breadcrumbService.hideRouteRegex(`^/${BLOG_CATEGORIES_ROUTE}/[0-9]+$`);
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${NEWS_CATEGORIES_ROUTE}`, "Категории новостей");
        this.breadcrumbService.hideRouteRegex(`^/${NEWS_CATEGORIES_ROUTE}/[0-9]+$`);
    }
}  