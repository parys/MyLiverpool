import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/index';
import { PipesModule } from '@base/pipes';
import { LayoutModule } from '@layout/layout.module';

import { MiniChatComponent } from '@chat/miniChat';
import { MaxiChatComponent } from '@chat/maxiChat';
import { ChatWindowComponent } from '@chat/chat-window';
import { chatRoutes } from '@chat/chat.routes';
import { ChatMessageService } from '@chat/chat-message.service';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(chatRoutes),
        PipesModule,
        LayoutModule // todo needed for users-online
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
