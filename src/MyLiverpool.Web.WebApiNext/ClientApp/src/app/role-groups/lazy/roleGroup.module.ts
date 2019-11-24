import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/index';
import { roleGroupRoutes } from '@role-groups/lazy/roleGroup.routes';
import { RoleGroupListComponent } from '@role-groups/lazy/roleGroup-list';
import { RoleGroupCoreModule } from '@role-groups/core/roleGroup-core.module';
import { BreadcrumbService } from '@base/breadcrumbs';
import { ROLE_GROUPS_ROUTE } from '@constants/routes.constants';

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
        this.breadcrumbService.addFriendlyNameForRoute(`/${ROLE_GROUPS_ROUTE}`, 'Группы и роли');
    }
}
