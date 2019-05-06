import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { PersonEditComponent } from './person-edit';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PersonCoreModule } from '../core';


@NgModule({
    imports: [
        SharedModule,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatSelectModule,
        PersonCoreModule
    ],
    declarations: [
        PersonEditComponent
    ],
    exports: [
        PersonEditComponent,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule
    ],
})
export class PersonEditModule { }
