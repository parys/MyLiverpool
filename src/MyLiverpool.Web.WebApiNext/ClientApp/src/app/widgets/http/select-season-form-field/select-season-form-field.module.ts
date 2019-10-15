import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeasonService } from '@seasons/season.service';
import { SelectSeasonFormFieldComponent } from './select-season-form-field/select-season-form-field.component';


@NgModule({
    declarations: [SelectSeasonFormFieldComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
    ],
    exports: [
        SelectSeasonFormFieldComponent
    ],
    providers: [
        SeasonService
    ]
})
export class SelectSeasonFormFieldModule { }
