import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


import { SharedModule } from '@shared/index';

import { PersonEditComponent } from '@persons/shared/person-edit';
import { PersonService } from '@persons/person.service';
import { CropImageFormFieldModule } from '@widgets/non-http/crop-image-form-field';


@NgModule({
    imports: [
        SharedModule,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatSelectModule,
        MatButtonModule,
        CropImageFormFieldModule,
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
    providers: [
        PersonService
    ]
})
export class PersonEditModule { }
