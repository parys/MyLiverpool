import { Component, OnInit, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DeleteDialogComponent } from '@shared/index';
import { RolesCheckedService } from '@base/auth';
import { MatchPerson, Person } from '@domain/models';

import { MatchPersonService } from '@match-persons/match-person.service';
import { SignalRService } from '@base/signalr';
import { ObserverComponent } from '@domain/base';

@Component({
    selector: 'match-person-info',
    templateUrl: './match-person-info.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchPersonInfoComponent extends ObserverComponent {
    @Input() public person: MatchPerson;
    @Input() public isHome: boolean;
    @Input() public isPlayer: boolean;
    @Input() public matchId: number;
    @Output() public selected: EventEmitter<MatchPerson> = new EventEmitter<MatchPerson>();

    constructor(private matchPersonService: MatchPersonService,
                public roles: RolesCheckedService,
                private snackBar: MatSnackBar,
                private dialog: MatDialog) {
        super();
    }
    public onSelectPerson(person: MatchPerson): void {
        this.selected.emit(person);
    }

    public showDeleteModal(person: MatchPerson): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        const sub$ = dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(person);
            }
        });
        this.subscriptions.push(sub$);
    }


    private delete(person: MatchPerson): void {
        const sub$ = this.matchPersonService.delete(this.matchId, person.personId)
            .subscribe((result: boolean) => {
                if (result) {
                    this.person = null;
                    this.snackBar.open('Удалено');
                } else {
                    this.snackBar.open('Ошибка удаления');
                }
            });
        this.subscriptions.push(sub$);
    }
}
