import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { staticPageRoutes } from "./staticPage.routes";
import { EditorModule } from "@app/editor";
import { PageEditorComponent } from "./page-editor";
import { StaticPageService } from "./staticPage.service";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(staticPageRoutes),
        EditorModule
    ],
    declarations: [
        PageEditorComponent
    ],
    providers: [
        StaticPageService
    ]
})
export class StaticPageModule {
    constructor(
//        private breadcrumbService: BreadcrumbService
    ) {
        //this.breadcrumbService.addFriendlyNameForRouteRegex(`/${USERS_ROUTE}`, USERS_RU);
        //this.breadcrumbService.addFriendlyNameForRouteRegex(`^/${USERS_ROUTE}/[0-9]+$`, USER_RU);
        //this.breadcrumbService.addFriendlyNameForRouteRegex(`^/${USERS_ROUTE}/[0-9]+/settings$`, "Настройки");
    }
}