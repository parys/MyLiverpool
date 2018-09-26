import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { MiniChatComponent } from "./miniChat";
import { MaxiChatComponent } from "./maxiChat";
import { ChatWindowComponent } from "./chat-window";
import { chatRoutes } from "./chat.routes";
import { UserCoreModule } from "@app/user";
import { EditorModule } from "@app/editor";
import { ChatMessageService } from "./chatMessage.service";


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(chatRoutes),
        EditorModule,
        UserCoreModule
    ],
    declarations: [
        MiniChatComponent,
        MaxiChatComponent,
        ChatWindowComponent
    ],
    exports: [
        MiniChatComponent,
        MaxiChatComponent,
        ChatWindowComponent
    ],
    providers: [
        ChatMessageService
    ]
})
export class ChatModule { }