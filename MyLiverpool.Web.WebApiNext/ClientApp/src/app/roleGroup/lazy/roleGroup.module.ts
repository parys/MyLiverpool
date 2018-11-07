import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { roleGroupRoutes } from "./roleGroup.routes";
import { RoleGroupListComponent } from "./roleGroup-list";
import { RoleGroupCoreModule } from "../core/roleGroup-core.module";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { ROLE_GROUPS_ROUTE } from "@app/+constants";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(roleGroupRoutes),
        RoleGroupCoreModule
    ],
    declarations: [
        RoleGroupListComponent
    ]
})
export class RoleGroupModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRoute(`/${ROLE_GROUPS_ROUTE}`, "Группы и роли");
    }
}