import { NgModule } from '@angular/core';
import { SignalRService } from './signalr.common.service';
import { StorageModule } from '@app/+storage';

@NgModule({
    imports: [
        StorageModule
    ],
    providers: [
        SignalRService
    ]
})
export class SignalRModule { }
