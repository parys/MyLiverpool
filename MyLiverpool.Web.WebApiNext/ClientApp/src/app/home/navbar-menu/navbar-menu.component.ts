import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RolesCheckedService } from '@app/+auth';

@Component({
    selector: 'navbar-menu',
    templateUrl: './navbar-menu.component.html',
    styleUrls: ['./navbar-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarMenuComponent {
    constructor(public roles: RolesCheckedService) {
    }
}
