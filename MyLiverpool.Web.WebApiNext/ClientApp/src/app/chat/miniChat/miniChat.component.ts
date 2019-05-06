import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'mini-chat',
    templateUrl: './miniChat.component.html',
    styleUrls: ['./miniChat.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniChatComponent {
}
