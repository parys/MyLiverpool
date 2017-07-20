import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { MdDialog } from '@angular/material';
import { Subscription } from "rxjs/Subscription"
import { MaterialComment } from "./materialComment.model";
import { CommentVote } from "./commentVote.model";
import { MaterialCommentService } from "./materialComment.service";
import { RolesCheckedService, IRoles, DeleteDialogComponent } from "../shared/index";

@Component({
    selector: "materialComment-detail",
    templateUrl: "./materialComment-detail.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MaterialCommentDetailComponent implements OnInit, OnDestroy {
    private vote$: Subscription;
    @Input() public item: MaterialComment;
    @Input() public deep: number;
    @Input() public canCommentary: boolean;
    @Input() public materialId: number;
    @Input() public parent: MaterialComment;

    public commentForm: FormGroup;          
    private oldCopy: MaterialComment;
    public isEditMode: boolean = false;
    public isAddingMode: boolean = false;

    public roles: IRoles;                

    constructor(private materialCommentService: MaterialCommentService,
        private location: Location,
        private sanitizer: DomSanitizer,
        private rolesChecked: RolesCheckedService,
        private dialog: MdDialog,
        private cd: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.roles = this.rolesChecked.checkRoles();
        this.initForm();
    }

    public ngOnDestroy(): void {
        if(this.vote$) { this.vote$.unsubscribe(); }
    }

    public showAddCommentModal(): void {
        this.isAddingMode = true;
        this.updateFormValues();
    }

    public showEditModal(): void {
        this.isEditMode = true;
        this.updateFormValues();
    }

    public showDeleteModal(): void {
        let dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete();
            }
        }, e => console.log(e));
    }

    public cancelAdding(): void {
        this.isAddingMode = false;
        this.updateFormValues();//does it need
    }

    public addComment(): void {
        this.commentForm.markAsPending();
        let comment = this.getNewComment();
        this.materialCommentService.create(comment)
            .subscribe(data => {
                this.item.children.push(data);
                this.cancelAdding();
                },
            error => console.log(error));
    }

    public vote(positive: boolean): void {
        const vote: CommentVote = new CommentVote();
        vote.positive = positive;
        vote.commentId = this.item.id;
        this.vote$ = this.materialCommentService.vote(vote).subscribe(data => {
                if (data) {
                    this.updateVotes(positive);
                    //todo add snackBar комментарий оценен
                }
            },
            e => console.log(e));
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
        const comment: MaterialComment = this.getComment();
        this.materialCommentService.update(this.item.id, comment)
            .subscribe(data => {
                this.item = comment;
                this.cancelEdit();
                },
            error => console.log(error));
    }

    public cancelEdit(): void {
        this.isEditMode = false;
        this.cd.markForCheck();
    }

    public sanitizeByHtml(text: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(text);
    }

    private delete(): void {
        let result: boolean;
        this.materialCommentService.delete(this.item.id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.item.children.forEach(x => {
                            if (this.parent) {
                                x.parentId = this.parent.id;
                                this.parent.children.push(x);
                            } else {
                                x.parentId = undefined;
                            }
                        });
                        this.item = undefined;
                    }

                    this.cd.markForCheck();
                }
            );
    }

    private initForm(): void {
        const message: string = this.isEditMode ? this.item.message : "";
        const answer: string = this.isEditMode ? this.item.answer : "";//todo here and below unite
        this.commentForm = this.formBuilder.group({
            'message': [message, Validators.required],
            'answer': [answer]
        });
        this.commentForm.valueChanges.subscribe(() => {
            this.cd.markForCheck();
        });
    }
    private updateFormValues(): void {
        const message: string = this.isEditMode ? this.item.message : "";
        const answer: string = this.isEditMode ? this.item.answer : "";
        this.commentForm.get("message").patchValue(message);
        this.commentForm.get("answer").patchValue(answer);
        this.cd.markForCheck();
    }

    private getComment(): MaterialComment {
        const comment: MaterialComment = this.item;
        comment.message = this.commentForm.controls["message"].value;
        comment.answer = this.commentForm.controls["answer"].value;
        return comment;
    }

    private getNewComment(): MaterialComment {
        const comment: MaterialComment = new MaterialComment();
        comment.message = this.commentForm.controls["message"].value;
        comment.materialId = this.materialId;
        comment.parentId = this.item.id;
        return comment;
    }
}                                                                                                                