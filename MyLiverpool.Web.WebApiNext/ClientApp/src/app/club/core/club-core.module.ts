import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ClubService } from './club.service';

@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
        ClubService
    ]
})
export class ClubCoreModule { }
