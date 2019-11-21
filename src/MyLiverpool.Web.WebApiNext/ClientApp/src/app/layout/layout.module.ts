import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
    MatchCalendarComponent,
    MatchCalendarEntryComponent,
    MatchHeaderComponent,
    NotificationCounterComponent,
    PersonBirthdayComponent,
    BestPlayerComponent,
    UserBirthdayComponent,
    UserOnlineCounterComponent,
    PmCounterComponent,
    CommentLastComponent,
    InjuryCurrentListComponent,
    CupTableComponent,
    EplTableComponent
} from '@layout/components/';
import { LayoutService } from '@layout/layout.service';
import { PipesModule } from '@base/pipes';
import { LayoutMaterialModule } from './layout-material.module';

const layoutComponents = [
    NotificationCounterComponent,
    MatchCalendarEntryComponent,
    MatchCalendarComponent,
    MatchHeaderComponent,
    BestPlayerComponent,
    PersonBirthdayComponent,
    UserBirthdayComponent,
    UserOnlineCounterComponent,
    PmCounterComponent,
    CommentLastComponent,
    InjuryCurrentListComponent,
    CupTableComponent,
    EplTableComponent
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        LayoutMaterialModule,
        PipesModule
    ],
    declarations: [
        ...layoutComponents
    ],
    exports: [
        ...layoutComponents
    ],
    providers: [
        LayoutService
    ]
})
export class LayoutModule { }
