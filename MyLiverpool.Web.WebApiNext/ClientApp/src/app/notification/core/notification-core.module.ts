import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { NotificationCounterComponent } from './notification-counter';
import { NotificationService } from './notification.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        NotificationCounterComponent
    ],
    exports: [
        NotificationCounterComponent
    ],
    providers: [
        NotificationService
    ]
})
export class NotificationCoreModule { }
