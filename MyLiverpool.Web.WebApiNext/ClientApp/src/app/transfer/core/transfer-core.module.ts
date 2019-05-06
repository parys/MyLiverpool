import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransferService } from './transfer.service';
import { SharedModule } from '@app/shared';

@NgModule({
    imports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        TransferService
    ]
})
export class TransferCoreModule { }
