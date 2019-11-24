import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { SharedModule } from '@shared/index';
import { EditorModule } from '@editor/index';
import { BreadcrumbService } from '@base/breadcrumbs';
import { PMS_ROUTE } from '@constants/index';
import { PmSharedModule } from '@pms/shared';
import { PipesModule } from '@base/pipes';

import { PmService } from '@pms/pm.service';
import { pmRoutes } from '@pms/lazy/pm.routes';
import { PmListComponent } from '@pms/lazy/pm-list';
import { PmDetailComponent } from '@pms/lazy/pm-detail';
import { PmEditComponent } from '@pms/lazy/pm-edit';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(pmRoutes),
        EditorModule,
        PmSharedModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatInputModule,
        PipesModule,
        MatButtonModule
    ],
    declarations: [
        PmEditComponent,
        PmDetailComponent,
        PmListComponent
    ],
    providers: [
        PmService
    ]
})
export class PmModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${PMS_ROUTE}`, 'Личные сообщения');
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${PMS_ROUTE}/[0-9]+$`, 'Сообщение');
    }
}
