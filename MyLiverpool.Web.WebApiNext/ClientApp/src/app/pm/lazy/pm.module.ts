import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { pmRoutes } from "./pm.routes";
import { PmListComponent } from "./pm-list";
import { PmDetailComponent } from "./pm-detail";
import { PmEditComponent } from "./pm-edit";
import { EditorModule } from "@app/editor";
import { MatTabsModule, MatAutocompleteModule, MatInputModule } from "@angular/material";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { PMS_ROUTE } from "@app/+constants";
import { PmSharedModule } from "../shared";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(pmRoutes),
        EditorModule,
        PmSharedModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatInputModule
    ],
    declarations: [
        PmEditComponent,
        PmDetailComponent,
        PmListComponent
    ]
})
export class PmModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${PMS_ROUTE}`, "Личные сообщения");
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${PMS_ROUTE}/[0-9]+$`, "Сообщение");
    }
}