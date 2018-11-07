import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { materialRoutes } from "./material.routes";
import { MaterialCoreModule } from "../core/material-core.module";
import { MaterialDetailComponent } from "./material-detail";
import { CommentCoreModule } from "@app/comment";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { NEWS_ROUTE, BLOGS_ROUTE, NEWSS_RU, NEWS_RU, BLOGS_RU, BLOG_RU } from "@app/+constants";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(materialRoutes),
        CommentCoreModule,
        MaterialCoreModule
    ],
    declarations: [
        MaterialDetailComponent
    ]
})
export class MaterialModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${NEWS_ROUTE}`, NEWSS_RU);
        this.breadcrumbService.addFriendlyNameForRouteRegex(`^/${NEWS_ROUTE}/[0-9]+$`, NEWS_RU);
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${BLOGS_ROUTE}`, BLOGS_RU);
        this.breadcrumbService.addFriendlyNameForRouteRegex(`^/${BLOGS_ROUTE}/[0-9]+$`, BLOG_RU);
    }
}