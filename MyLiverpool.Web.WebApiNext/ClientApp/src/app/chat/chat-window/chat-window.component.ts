import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, ChangeDetectionStrategy, AfterContentChecked } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ChatMessage } from "@app/+common-models";
import { ChatMessageService } from "../chatMessage.service";
import { DeleteDialogComponent } from "@app/shared";
import { RolesCheckedService } from "@app/+auth";
import { SignalRService } from "@app/+signalr";
import { EditorComponent } from "@app/editor";
import { MAX_CHAT_MESSAGE_LENGTH, MESSAGE } from "@app/+constants";

@Component({
    selector: "chat-window",
    templateUrl: "./chat-window.component.html",
    styleUrls: ["./chat-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWindowComponent implements OnInit, AfterContentChecked {
    public messageForm: FormGroup;
    public items: ChatMessage[] = new Array<ChatMessage>();
    public selectedEditIndex: number = null;

    @ViewChild("chatInput") private elementRef: EditorComponent;
    @Input("type") public type: number;
    @Input() public height: number = 200;

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
        this.roles.rolesChanged.subscribe(() =>
            this.cd.markForCheck());
    }

    public ngAfterContentChecked(): void {
        this.cd.markForCheck();
    }

    public update(): void {
        const id: number = this.items.length > 0 ? this.items[0].id : 0;
        this.service
            .getLatest(id, this.type) //todo use filter?
            .subscribe((data: ChatMessage[]) => {
                    this.items = data.concat(this.items);
                },
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
                this.putToChat(data);
                this.cancelEdit();
            });
        //} else {
        //    this.service.create(message)
        //        .subscribe(data => {
        //                this.putToChat(data);
        //            },
        //            (e) => console.log(e));
        //}
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
        let message: string = this.messageForm.get(MESSAGE).value;
        let userName: string = this.items[index].authorUserName;
        let newMessage: string = `<i>${userName}</i>, ${message}`;
        this.messageForm.get(MESSAGE).patchValue(newMessage);
        this.elementRef.setFocus();
        this.cd.markForCheck();
    }
    
    public edit(index: number): void {
        this.selectedEditIndex = index;
        this.messageForm.get(MESSAGE).patchValue(this.items[index].message);
    }

    public cancelEdit(): void {
        this.selectedEditIndex = null;
        this.messageForm.get(MESSAGE).patchValue("");
        this.cd.markForCheck();
    }

    private delete(index: number): void {
        this.service.delete(this.items[index].id).subscribe(data => {
            if (data) {
                this.items.slice(index, 1);
                this.items = this.items.concat([]);
                this.snackBar.open("Комментарий удален");
            }
        },
            e => {
                console.log(e);
                this.snackBar.open("Комментарий НЕ удален");
            }, () => {
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
            this.messageForm.get(MESSAGE).patchValue("");
        }
        this.cd.markForCheck();
    }

    private initForm(message: string = ""): void {
        this.messageForm = this.formBuilder.group({
            message: [message, Validators.compose([Validators.required, Validators.maxLength(MAX_CHAT_MESSAGE_LENGTH)])], //todo add visual warning
            typeId: [this.type, Validators.required]
        });
        this.messageForm.valueChanges.subscribe(() => {
            this.cd.markForCheck();
        });
    }
}