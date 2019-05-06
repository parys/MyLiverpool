import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared';
import { CommentService } from './comment.service';
import { CommentLastComponent } from './comment-last';
import { EditorModule } from '@app/editor';

@NgModule({
    imports: [
        SharedModule,
        EditorModule,
        RouterModule,
    ],
    declarations: [
        CommentLastComponent,
    ],
    exports: [
        CommentLastComponent,
    ],
    providers: [
        CommentService
    ]
})
export class CommentCoreModule { }
