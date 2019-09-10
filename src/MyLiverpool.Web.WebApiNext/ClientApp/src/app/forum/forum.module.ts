import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ForumSectionListComponent, ForumSectionService } from './forumSection';
import * as forumSubsection from '@forum/forumSubsection';
import * as forumMessage from '@forum/forumMessage';
import * as forumTheme from '@forum/forumTheme';
import { forumRoutes } from '@forum/forum.routes';
import { SharedModule } from '@shared/index';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from '@base/pipes';

@NgModule({
    imports: [
        CommonModule,
        NgxPaginationModule,
        RouterModule.forChild(forumRoutes),
        SharedModule,
        PipesModule
    ],
    declarations: [
        forumMessage.ForumMessageAdditionComponent,
        forumSubsection.ForumSubsectionEditComponent,
        forumSubsection.ForumSubsectionListComponent,
        forumTheme.ForumThemeEditComponent,
        forumTheme.ForumThemeListComponent,
        ForumSectionListComponent
    ],
    exports: [
    ],
    providers: [
        forumMessage.ForumMessageService,
        forumSubsection.ForumSubsectionService,
        forumTheme.ForumThemeService,
        ForumSectionService
    ]
})
export class ForumModule { }
