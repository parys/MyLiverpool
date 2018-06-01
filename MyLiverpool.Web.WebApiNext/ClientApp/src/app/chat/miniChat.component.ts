import { Component, OnInit, OnDestroy, ChangeDetectorRef, PLATFORM_ID, Inject, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { isPlatformBrowser } from "@angular/common";
import { MatDialog, MatSnackBar } from "@angular/material";
import { interval, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Configuration } from "@app/app.constants";
import { ChatMessage } from "./chatMessage.model";
import { ChatMessageType } from "./chatMessageType.enum";
import { ChatMessageService } from "./chatMessage.service";
import { RolesCheckedService, DeleteDialogComponent, StorageService } from "@app/shared";
import { EditorComponent } from "@app/editor";
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";

@Component({
    selector: "mini-chat",
    templateUrl: "./miniChat.component.html",
    changeDetection: ChangeDetectionStrategy.Default //todo temporary before doing roles observable
})
export class MiniChatComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private updater$: Subscription;
    public messageForm: FormGroup;
    public chatTimerForm: FormGroup;
    public items: ChatMessage[] = new Array<ChatMessage>();
    public selectedEditIndex: number = null;
    private chatHub: HubConnection;
    public intervalArray: { key: string, value: number }[]
        = [{ key: "---", value: 0 },
        { key: "15 сек", value: 15 },
        { key: "30 сек", value: 30 },
        { key: "1 мин", value: 60 },
        { key: "2 мин", value: 120 }];
    @ViewChild("chatInput") private elementRef: EditorComponent;

    constructor(private service: ChatMessageService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        private snackBar: MatSnackBar,
        private configuration: Configuration,
        private sanitizer: DomSanitizer,
        public roles: RolesCheckedService,
        private storage: StorageService,
        private dialog: MatDialog,
        @Inject('BASE_URL') private baseUrl: string) {

        //this.chatHub = new HubConnection("/hub");
     
        //this.chatHub.start();
    }

    public ngOnInit(): void {
        let tokens = this.storage.retrieveTokens();
        this.chatHub = new HubConnectionBuilder().withUrl(`${this.baseUrl}hubs/chat?token=${tokens.access_token}`).build();
        this.chatHub.on("sendChat", (data) => {
            console.warn(data);
        });
        this.initForm();
        this.update();

        this.chatHub.start()
            .then(() => {
                console.log('Hub connection started');
            })
            .catch(err => {
                console.log('Error while establishing connection: ' + err);
            });
    }

    public ngOnDestroy() {
        if (this.updater$) { this.updater$.unsubscribe(); }
    }

    public update(): void {
        const id: number = this.items.length > 0 ? this.items[0].id : 0;
        this.service
            .getAll(id, ChatMessageType.Mini)
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
                this.chatHub.invoke("sendChat", this.messageForm.value);
            //this.service.create(this.messageForm.value)
            //    .subscribe(data => {
            //        this.items.unshift(data);
            //        this.messageForm.get("message").patchValue("");
            //        this.cd.markForCheck();
            //    },
            //    (e) => console.log(e));
        }
    }

    public showDeleteModal(index: number): void {
        //     this.chatHub.invoke("send", this.count*10);
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(index);
            }
        },
            e => console.log(e));
    }

    public updateSchedule(event: any): void {
        let value = event.value || event.target.value;
        this.scheduleUpdate(value);
        this.storage.setChatUpdateTime(value);
    }

    private scheduleUpdate(selectedValue: number) {
        if (selectedValue === 0) {
            if (this.updater$) {
                this.updater$.unsubscribe();
            }
        } else {
            this.updater$ = interval(1000 * selectedValue).pipe(
                map(x => this.update()))
                .subscribe();
        }
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
            typeId: [ChatMessageType.Mini, Validators.required]
        });
        this.messageForm.valueChanges.subscribe(() => {
            this.cd.markForCheck();
        });
        let timerValue: number = this.storage.getChatUpdateTime();
        if (isPlatformBrowser(this.platformId)) {
            if (timerValue) {
                this.scheduleUpdate(timerValue);
            }
        }
        this.chatTimerForm = this.formBuilder.group({
            timerValue: [timerValue]
        });
    }
}