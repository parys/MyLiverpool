import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Comment, CommentVote } from '@domain/models';
import { DeleteDialogComponent } from '@shared/index';
import { CommentService } from '@comments/comment.service';
import { EditorComponent } from '@editor/index';
import { ObserverComponent } from '@domain/base';
import { SignalRService } from '@base/signalr';
import { Select } from '@ngxs/store';
import { AuthState } from '@auth/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'comment-detail',
    templateUrl: './comment-detail.component.html',
    styleUrls: ['./comment-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommentDetailComponent extends ObserverComponent implements OnInit {
    @Input() public item: Comment;
    @Input() public deep: number;
    @Input() public canCommentary: boolean;
    @Input() public materialId: number;
    @Input() public matchId: number;
    @Input() public parent: Comment;
    @Input() public type: number;
    @ViewChild('replyInput') private elementRef: EditorComponent;

    @Select(AuthState.isEditor) isEditor$: Observable<boolean>;

    @Select(AuthState.isModerator) isModerator$: Observable<boolean>;

    @Select(AuthState.isLogined) isLogined$: Observable<boolean>;

    @Select(AuthState.userId) userId$: Observable<number>;

    public commentForm: FormGroup;
    public isEditMode = false;
    public isAddingMode = false;

    constructor(private materialCommentService: CommentService,
                private dialog: MatDialog,
                private cd: ChangeDetectorRef,
                private formBuilder: FormBuilder,
                private signalRService: SignalRService) {
        super();
    }

    public ngOnInit(): void {
        this.initForm();

        const sub$ = this.signalRService.newComment.subscribe((data: Comment) => {
            if (data.matchId === this.matchId || data.materialId === this.materialId) {
                if (data.parentId === this.item.id) {
                    const index = this.item.children.findIndex(x => x.id === data.id);
                    if (index !== -1) {
                        this.item.children[index] = data;
                    } else {
                        this.item.children.push(data);
                    }
                    this.cd.markForCheck();
                }
            }
        });
        this.subscriptions.push(sub$);
    }

    public verify(): void {
        const sub$ = this.materialCommentService
            .verify(this.item.id)
            .subscribe(data => {
                if (data) {
                    this.item.isVerified = true;
                    this.cd.markForCheck();
                }
            });
        this.subscriptions.push(sub$);
    }

    public showAddCommentModal(): void {
        this.isAddingMode = true;
        this.initForm();
        this.cd.detectChanges();
        this.elementRef.setFocus();
    }

    public showEditModal(): void {
        this.isEditMode = true;
        this.initForm();
        this.cd.detectChanges();
        this.elementRef.setFocus();
    }

    public showDeleteModal(): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        const sub$ = dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete();
            }
        });
        this.subscriptions.push(sub$);
    }

    public cancelAdding(): void {
        this.isAddingMode = false;
        this.cd.markForCheck();
    }

    public addComment(): void {
        this.commentForm.markAsPending();
        const comment = this.getNewComment();
        const sub$ = this.materialCommentService.createOrUpdate(comment.id, comment)
            .subscribe((data: Comment) => {
                this.cancelAdding();
            });
        this.subscriptions.push(sub$);
    }

    public vote(positive: boolean): void {
        const vote: CommentVote = new CommentVote();
        vote.positive = positive;
        vote.commentId = this.item.id;
        const sub$ = this.materialCommentService.vote(vote).subscribe(data => {
            if (data) {
                this.updateVotes(positive);
            }
        });
        this.subscriptions.push(sub$);
    }

    private updateVotes(positive: boolean): void {
        if (positive) {
            this.item.positiveCount += 1;
            if (!this.item.canNegativeVote) {
                this.item.negativeCount += 1;
            }
            this.item.canPositiveVote = false;
            this.item.canNegativeVote = true;
        } else {
            this.item.negativeCount -= 1;
            if (!this.item.canPositiveVote) {
                this.item.positiveCount -= 1;
            }
            this.item.canPositiveVote = true;
            this.item.canNegativeVote = false;
        }
        this.cd.markForCheck();
    }

    public editComment(): void {
        this.commentForm.markAsPending();
        const comment: Comment = this.getComment();
        const sub$ = this.materialCommentService.createOrUpdate(this.item.id, comment)
            .subscribe((data: Comment) => {
                this.item = comment;
                this.cancelEdit();
            });
        this.subscriptions.push(sub$);
    }

    public cancelEdit(): void {
        this.isEditMode = false;
        this.cd.markForCheck();
    }

    public trackByFn(index: number, item: Comment) {
        if (!item) { return null; }
        return item.id;
    }


    private delete(): void {
        const sub$ = this.materialCommentService.delete(this.item.id)
            .subscribe((res: boolean) => {
                if (res) {
                    this.item.children.forEach((x: Comment) => {
                        if (this.parent) {
                            x.parentId = this.parent.id;
                            this.parent.children.push(x);
                        } else {
                            x.parentId = undefined;
                        }
                    });
                    this.item = undefined;
                }
            },
                null,
                () => {
                    this.cd.detectChanges();
                }
            );
        this.subscriptions.push(sub$);
    }

    private initForm(): void {
        const message: string = this.isEditMode ? this.item.message : '';
        const answer: string = this.isEditMode ? this.item.answer : '';
        this.commentForm = this.formBuilder.group({
            message: [message, Validators.required],
            answer: [answer]
        });
        const sub$ = this.commentForm.valueChanges.subscribe(() => {
            this.cd.markForCheck();
        });
        this.subscriptions.push(sub$);
    }

    private getComment(): Comment {
        const comment: Comment = this.item;
        comment.message = this.commentForm.controls['message'].value;
        comment.answer = this.commentForm.controls['answer'].value;
        return comment;
    }

    private getNewComment(): Comment {
        const comment: Comment = new Comment();
        comment.message = this.commentForm.controls['message'].value;
        comment.materialId = this.materialId;
        comment.matchId = this.matchId;
        comment.parentId = this.item.id;
        comment.type = this.type;
        return comment;
    }
}

