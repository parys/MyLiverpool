import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, ChangeDetectionStrategy, AfterContentChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ChatMessage, ChatFilters, PagedList } from '@domain/models';
import { DeleteDialogComponent } from '@shared/index';
import { RolesCheckedService } from '@base/auth';
import { SignalRService } from '@base/signalr';
import { MAX_CHAT_MESSAGE_LENGTH, MESSAGE } from '@constants/index';

import { ChatMessageService } from '@chat/chat-message.service';
@Component({
    selector: 'chat-window',
    templateUrl: './chat-window.component.html',
    styleUrls: ['./chat-window.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWindowComponent implements OnInit, AfterContentChecked {
    public messageForm: FormGroup;
    public items: ChatMessage[] = new Array<ChatMessage>();
    public selectedEditIndex: number = null;

  //  @ViewChild('chatInput', { static: false })private elementRef: EditorComponent;
    @Input() public type: number;
    @Input() public height = 200;

    constructor(private service: ChatMessageService,
                private formBuilder: FormBuilder,
                private cd: ChangeDetectorRef,
                private snackBar: MatSnackBar,
                public roles: RolesCheckedService,
                private dialog: MatDialog,
                private signalRService: SignalRService) {
    }

    public ngOnInit(): void {
        this.initForm();
        this.update();
        this.signalRService.chatSubject.subscribe((data: ChatMessage) => {
            if (this.type === data.type) {
                this.putToChat(data, false);
            }
        });
        // this.roles.rolesChanged.subscribe(() =>
        //    this.cd.markForCheck());
    }

    public ngAfterContentChecked(): void {
        this.cd.markForCheck();
    }

    public update(): void {
        const id: number = this.items.length > 0 ? this.items[0].id : 0;
        const chatFilters = new ChatFilters();
        chatFilters.lastMessageId = id;
        chatFilters.typeId = this.type;
        this.service
            .getAll(chatFilters)
            .subscribe((data: PagedList<ChatMessage>) => {
                    this.items = data.results.concat(this.items);
                },
                null,
                () => this.cd.markForCheck());
    }

    public onSubmit(): void {
        this.messageForm.markAsPending();
        let message: ChatMessage = this.messageForm.value;
        message.type = this.type;

        if (this.selectedEditIndex != null) {
            message = this.items[this.selectedEditIndex];
            message.message = this.messageForm.get(MESSAGE).value;
        }

        this.service.createOrUpdate(message.id, message).subscribe(data => {
                this.cancelEdit();
            });
    }

    public showDeleteModal(index: number): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.delete(index);
                }
            });
    }

    public addReply(index: number): void {
        const message: string = this.messageForm.get(MESSAGE).value;
        const userName: string = this.items[index].userName;
        const newMessage = `<i>${userName}</i>, ${message}`;
        this.messageForm.get(MESSAGE).patchValue(newMessage);
      //  this.elementRef.setFocus();
        this.cd.markForCheck();
    }

    public edit(index: number): void {
        this.selectedEditIndex = index;
        this.messageForm.get(MESSAGE).patchValue(this.items[index].message);
    }

    public cancelEdit(): void {
        this.selectedEditIndex = null;
        this.messageForm.get(MESSAGE).patchValue('');
        this.cd.markForCheck();
    }

    public trackByFn(index: number, item: ChatMessage) {
        if (!item) { return null; }
        return item.id;
    }

    private delete(index: number): void {
        this.service.delete(this.items[index].id).subscribe(data => {
                if (data) {
                    this.items.slice(index, 1);
                    this.snackBar.open('Коммент удален');
                }
            },
            () => {
                this.snackBar.open('Коммент НЕ удален');
            },
            () => {
                this.cd.markForCheck();
            });
    }


    private putToChat(message: ChatMessage, clearAfter: boolean = true): void {
        const index = this.items.findIndex(x => x.id === message.id);

        if (index !== -1) {
            this.items[index] = message;
        } else {
            this.items.unshift(message);
        }
        if (clearAfter) {
            this.messageForm.get(MESSAGE).patchValue('');
        }
        this.cd.markForCheck();
    }

    private initForm(message: string = ''): void {
        this.messageForm = this.formBuilder.group({
            message: [message,
                Validators.compose([Validators.required,
                    Validators.maxLength(MAX_CHAT_MESSAGE_LENGTH)])], // todo add visual warning
            typeId: [this.type, Validators.required]
        });
        this.messageForm.valueChanges.subscribe(() => {
            this.cd.markForCheck();
        });
    }
}
