import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { RouterModule } from '@angular/router';
import { UserService } from './user.service';
import { UserBirthdayComponent } from './user-birthday';
import { UserOnlineCounterComponent } from './user-online-counter';
import { PmCoreModule } from '@app/pm';

@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        PmCoreModule
    ],
    declarations: [
        UserBirthdayComponent,
        UserOnlineCounterComponent
    ],
    exports: [
        UserOnlineCounterComponent,
        UserBirthdayComponent,
        PmCoreModule
    ],
    providers: [
        UserService
    ]
})
export class UserCoreModule { }
