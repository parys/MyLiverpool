import { NgModule } from '@angular/core';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

import { getRussianPaginatorIntl } from './russian-paginator-intl';

@NgModule({
    imports: [
      MatPaginatorModule
    ],
    exports: [
        MatPaginatorModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getRussianPaginatorIntl() },
    ]
})
export class PaginationModule { }
