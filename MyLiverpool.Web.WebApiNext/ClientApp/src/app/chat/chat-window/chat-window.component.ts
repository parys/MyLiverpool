﻿import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, Input, Inject, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
//import { isPlatformBrowser } from "@angular/common";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Configuration } from "@app/app.constants";
import { ChatMessage } from "../chatMessage.model";
import { ChatMessageService } from "../chatMessage.service";
import { RolesCheckedService, DeleteDialogComponent, StorageService } from "@app/shared";
import { EditorComponent } from "@app/editor";
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";

@Component({
    selector: "chat-window",
    templateUrl: "./chat-window.component.html",
    changeDetection: ChangeDetectionStrategy.Default //todo temporary before doing roles observable
})
export class ChatWindowComponent implements OnInit {
    public messageForm: FormGroup;
    public items: ChatMessage[] = new Array<ChatMessage>();
    public selectedEditIndex: number = null;
    private chatHub: HubConnection;

    @ViewChild("chatInput") private elementRef: EditorComponent;
    @Input("type") public type: number;
    @Input() public height: number = 200;

    constructor(private service: ChatMessageService,
     //   @Inject(PLATFORM_ID) private platformId: Object,
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        private snackBar: MatSnackBar,
        private configuration: Configuration,
        private sanitizer: DomSanitizer,
        public roles: RolesCheckedService,
        private storage: StorageService,
        private dialog: MatDialog,
        @Inject('BASE_URL') private baseUrl: string) {
    }

    public ngOnInit(): void {
        let tokens = this.storage.retrieveTokens();
        let accessToken = "";
        if (tokens) {
            accessToken = tokens.access_token;
        }
        var options = {
            accessTokenFactory: function () { return accessToken; }
        };
        //if (isPlatformBrowser(this.platformId)) {
   //     let options = new IHttpConnectionOptions();
        this.chatHub = new HubConnectionBuilder().withUrl(`${this.baseUrl}hubs/miniChat`, options).build();
       // this.chatHub = new HubConnectionBuilder().withUrl(`${this.baseUrl}hubs/miniChat?access_token=${accessToken}`, options).build();
        this.chatHub.on("sendMiniChat", (data: ChatMessage) => {
            if (this.type === data.type) {
                const index = this.items.findIndex(x => x.id === data.id);
                if (index !== -1) {
                    this.items[index] = data;
                } else {
                    this.items.unshift(data);
                }
                this.messageForm.get("message").patchValue("");
                this.cd.markForCheck();
            }
        });

        this.chatHub.start()
            .then(() => {
            })
            .catch(err => {
                alert("ошибка хаба чата");
            });
        this.initForm();
        this.update();
    }

    public update(): void {
        const id: number = this.items.length > 0 ? this.items[0].id : 0;
        this.service
            .getAll(id, this.type)
            .subscribe((data: ChatMessage[]) => {
                this.items = data.concat(this.items);
            },
                error => console.log(error),
                () => {
                    this.cd.markForCheck();
                });
    }

    public onSubmit(): void {
        this.messageForm.markAsPending();
        if (this.selectedEditIndex != null) {
            const message: ChatMessage = this.items[this.selectedEditIndex];
            message.message = this.messageForm.get("message").value;
            this.service.update(message.id, message).subscribe(data => {
                    this.cancelEdit();
                },
                e => console.log(e));
        } else {
            const message: ChatMessage = this.messageForm.value;
            message.type = this.type;
            this.service.create(message)
                .subscribe(data => {
                    },
                    (e) => console.log(e));
        }
    }

    public showDeleteModal(index: number): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.delete(index);
                }
            },
            e => console.log(e));
    }

    private delete(index: number): void {
        this.service.delete(this.items[index].id).subscribe(data => {
            if (data) {
                this.items.slice(index, 1);
                this.items = this.items.concat([]);
                this.snackBar.open("Комментарий успешно удален", null, { duration: 5000 });
            }
        },
            e => {
                console.log(e);
                this.snackBar.open("Комментарий НЕ удален", null, { duration: 5000 });
            }, () => {
                this.cd.markForCheck();
            });
    }

    public addReply(index: number): void {
        let message: string = this.messageForm.get("message").value;
        let userName: string = this.items[index].authorUserName;
        let newMessage: string = `<i>${userName}</i>, ${message}`;
        this.messageForm.get("message").patchValue(newMessage);
        this.elementRef.setFocus();
        this.cd.markForCheck();
    }

    public sanitizeByHtml(text: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(text);
    }

    public edit(index: number): void {
        this.selectedEditIndex = index;
        this.messageForm.get("message").patchValue(this.items[index].message);
    }

    public cancelEdit(): void {
        this.selectedEditIndex = null;
        this.messageForm.get("message").patchValue("");
        this.cd.markForCheck();
    }

    private initForm(message: string = ""): void {
        this.messageForm = this.formBuilder.group({
            message: [message, Validators.compose([Validators.required, Validators.maxLength(this.configuration.maxChatMessageLength)])], //todo add visual warning
            typeId: [this.type, Validators.required]
        });
        this.messageForm.valueChanges.subscribe(() => {
            this.cd.markForCheck();
        });
    }
}