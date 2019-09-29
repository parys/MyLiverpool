import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DeleteDialogComponent } from '@shared/index';
import { RolesCheckedService } from '@base/auth';
import { MatchEvent } from '@domain/models';

import { MatchEventService } from '@match-events/matchEvent.service';

@Component({
    selector: 'match-event-match-panel',
    templateUrl: './matchEvent-match-panel.component.html',
    styleUrls: ['./matchEvent-match-panel.component.scss']
})
export class MatchEventMatchPanelComponent implements OnInit {
    @Input() public matchId: number;
    @Input() public isHome: boolean;
    @Input() public seasonId: number;
    public events: MatchEvent[];
    public isEditEvent = false;
    public isHomeEdit = false;
    public selectedIndex: number;

    constructor(private matchEventService: MatchEventService,
                public roles: RolesCheckedService,
                private snackBar: MatSnackBar,
                private dialog: MatDialog) {
    }

    public ngOnInit(): void {
        this.matchEventService.getMatchEvents(this.matchId)
            .subscribe(data => this.events = data);
    }

    public addEvent(home: boolean): void {
        this.isEditEvent = true;
        this.isHomeEdit = home;
    }

    public cancelEventEdit(): void {
        this.isEditEvent = false;
        this.selectedIndex = null;
    }

    public updateEvent(event: MatchEvent) {
        if (this.selectedIndex) {
            this.events[this.selectedIndex] = event;
        } else {
            this.events.push(event);
        }

        this.cancelEventEdit();
    }

    public selectEvent(index: number): void {
        this.selectedIndex = index;
        this.isEditEvent = true;
    }


    public showDeleteModal(index: number): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(index);
            }
        });
    }


    private delete(index: number): void {
        this.matchEventService.delete(this.events[index].id)
            .subscribe(res => {
                    if (res) {
                        this.events.splice(index, 1);
                        this.snackBar.open('Удалено');
                    } else {
                        this.snackBar.open('Ошибка удаления');
                    }
                });
    }
}
