import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { SharedModule } from '@shared/index';
import { AccountSigninComponent } from './account-signin';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        AccountSigninComponent
    ],
    exports: [
        AccountSigninComponent,
    ],
    providers: [
    ]
})
export class AccountCoreModule { }
