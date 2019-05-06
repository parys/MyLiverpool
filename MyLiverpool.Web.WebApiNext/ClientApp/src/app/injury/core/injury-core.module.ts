import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InjuryCurrentListComponent } from './injury-current-list';
import { InjuryService } from './injury.service';
import { SharedModule } from '@app/shared';

@NgModule({
    imports: [
        SharedModule,
        RouterModule
    ],
    declarations: [
        InjuryCurrentListComponent
    ],
    exports: [
        InjuryCurrentListComponent
    ],
    providers: [
        InjuryService
    ]
})
export class InjuryCoreModule { }
