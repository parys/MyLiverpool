import { NgModule } from '@angular/core';
import { SafePipe } from './safe.pipe';
import { CustomDatePipe } from './date.pipe';
import { ImgPipe } from './img.pipe';

@NgModule({
    imports: [
      //  CommonModule,
    ],
    declarations: [
        CustomDatePipe,
        SafePipe,
        ImgPipe
    ],
    exports: [
        CustomDatePipe,
        SafePipe,
        ImgPipe
    ]
})
export class PipesModule { }
