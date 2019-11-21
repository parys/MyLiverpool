import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImageCropperModule } from 'ngx-image-cropper';

import { CropImageFormFieldComponent } from './crop-image-form-field/crop-image-form-field.component';

@NgModule({
    declarations: [CropImageFormFieldComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        ImageCropperModule    ],
    exports: [
        CropImageFormFieldComponent
    ],
    providers: [
    ]
})
export class CropImageFormFieldModule { }
