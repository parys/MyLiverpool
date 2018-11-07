import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { ImageCoreModule } from "../core";
import { ImageDetailComponent } from "./image-detail";
import { ImageListComponent } from "./image-list";
import { imageRoutes } from "./image.routes";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { IMAGES_ROUTE } from "@app/+constants";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(imageRoutes),
        ImageCoreModule
    ],
    declarations: [
        ImageDetailComponent,
        ImageListComponent
    ]
})
export class ImageModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${IMAGES_ROUTE}`, "Изображения");
    }
}