import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { MdDialog } from '@angular/material';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Subscription } from "rxjs/Subscription";
import { ForumThemeService } from "./forumTheme.service";
import { ForumMessage, ForumMessageService } from "../forumMessage/index";
import { ForumTheme } from "./forumTheme.model";
import { RolesCheckedService, IRoles, DeleteDialogComponent } from "../../shared/index";

@Component({
    selector: "forumTheme-list",
    templateUrl: "./forumTheme-list.component.html"
})
export class ForumThemeListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public item: ForumTheme;
    public items: ForumMessage[];
    public roles: IRoles;         
    public page: number = 1;
    public itemsPerPage = 15;
    public totalItems: number;
    public commentForm: FormGroup;
    public isEditMode: boolean = false;
    public selectedCommentIndex: number = null;

    constructor(private service: ForumThemeService,
        private messageService: ForumMessageService,
        private rolesChecked: RolesCheckedService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private formBuilder: FormBuilder,
        private location: Location,
        private dialog: MdDialog) {
    }

    public ngOnInit(): void {
        this.roles = this.rolesChecked.checkRoles();
        this.sub = this.route.queryParams.subscribe(qParams => {
                this.page = +qParams["page"] || 1;
            },
            e => console.log(e));
        this.update(+this.route.snapshot.params["id"]);
    };

    public ngOnDestroy(): void {
        if (this.sub) this.sub.unsubscribe();
    }

    public pageChanged(event: any): void {
        this.page = event;
        this.update(this.item.id);
        let newUrl = `forum/${this.item.subsectionId}/themes/${this.item.id}?page=${this.page}`;

        this.location.replaceState(newUrl);
    };

    public addNewMessage(message: ForumMessage) {
        this.items.push(message);
        this.totalItems += 1;
    }

    public showEditModal(index: number): void {
        this.isEditMode = true;
        this.selectedCommentIndex = index;
        this.initForm(index);
    }

    public hideEditModal() {
        this.commentForm = null;
        this.isEditMode = false;
    }
    public showDeleteModal(index: number): void {
        let dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(index);
            }
        }, e => console.log(e));
    }

    public editComment(index: number): void {
        let comment = this.items[index];
        comment.message = this.commentForm.get("message").value;
        this.messageService.update(comment.id, comment)
            .subscribe(data => {
                this.items[index].message = data.message;
                this.items[index].lastModifiedTime = data.lastModifiedTime;
                this.hideEditModal();
            },
            error => console.log(error));
    }

    public sanitizeByHtml(text: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(text);
    }

    private delete(index: number): void {
        let result : boolean;
        this.messageService.delete(this.items[index].id)
            .subscribe(res => result = res,
            e => console.log(e),
            () => {
                if (result) {
                    this.items.splice(index, 1);
                    this.totalItems -= 1;
                }
            });
    }

    private initForm(index: number = null) {
        let initValue = index !== null ? this.items[index].message : "";
        this.commentForm = this.formBuilder.group({
            'message': [initValue, Validators.compose([
                Validators.required])]
        });
    }

    private update(id: number): void {
        this.service.getSingleWithMessages(id, this.page)
            .subscribe(data => {
                this.item = data;
                this.itemsPerPage = data.messages.itemPerPage;
                this.items = data.messages.list;
                this.totalItems = data.messages.totalItems;
            },
            error => console.log(error));
    }
}