import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SharedModule } from '@shared/index';
import { commentRoutes } from '@comments/lazy/comment.routes';
import { CommentListComponent } from '@comments/lazy/comment-list';
import { EditorModule } from '@editor/index';
import { CommentSharedModule } from '@comments/shared';
import { BreadcrumbService } from '@base/breadcrumbs';
import { COMMENTS_ROUTE, COMMENTS_RU } from '@constants/index';
import { CommentService } from '@comments/comment.service';
import { PaginationModule } from '@base/pagination/pagination.module';

@NgModule({
    imports: [
        SharedModule,
        EditorModule,
        RouterModule.forChild(commentRoutes),
        CommentSharedModule,
        MatCheckboxModule,
        PaginationModule
    ],
    declarations: [
        CommentListComponent,
    ],
    providers: [
        CommentService
    ]
})
export class CommentModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${COMMENTS_ROUTE}`, COMMENTS_RU);
    }
}
