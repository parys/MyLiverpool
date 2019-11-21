import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { InjuryEditComponent } from '@injuries/lazy/injury-edit';
import { InjuryListComponent } from '@injuries/lazy/injury-list';
import { injuryRoutes } from '@injuries/lazy/injury.routes';

import { SharedModule } from '@shared/index';

import { BreadcrumbService } from '@shared/breadcrumb';
import { INJURIES_ROUTE } from '@constants/routes.constants';
import { InjuryService } from '@injuries/injury.service';
import { INJURIES_RU } from '@constants/ru.constants';
import { SelectPersonFormFieldModule } from '@widgets/http/select-person-form-field';
import { PaginationModule } from '@base/pagination/pagination.module';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(injuryRoutes),
        MatNativeDateModule,
        MatDatepickerModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatButtonModule,
        SelectPersonFormFieldModule,
        PaginationModule
    ],
    declarations: [
        InjuryEditComponent,
        InjuryListComponent
    ],
    providers: [
        InjuryService
    ]
})
export class InjuryModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${INJURIES_ROUTE}`, INJURIES_RU);
        this.breadcrumbService.hideRouteRegex(`^/${INJURIES_ROUTE}/[0-9]+$`);
    }
}
