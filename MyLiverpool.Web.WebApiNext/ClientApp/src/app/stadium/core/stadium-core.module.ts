import { NgModule } from '@angular/core';
import { StadiumService } from './stadium.service';
import { SharedModule } from '@app/shared';

@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
        StadiumService
    ]
})
export class StadiumCoreModule { }
